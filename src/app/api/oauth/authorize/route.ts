import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db/connect";
import { Client } from "../../../../models/Client";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const clientId = url.searchParams.get("client_id");
    const redirectUri = url.searchParams.get("redirect_uri");
    const responseType = url.searchParams.get("response_type");

    if (!clientId || !redirectUri || responseType !== "code") {
      return NextResponse.json({ error: "Missing or invalid OAuth parameters" }, { status: 400 });
    }

    await dbConnect();

    // Verify the client app exists
    const client = await Client.findOne({ clientId });
    if (!client || !client.redirectUris.includes(redirectUri)) {
      return NextResponse.json({ error: "Unauthorized Client or Redirect URI" }, { status: 403 });
    }

    // Success! Bounce them to the UI to actually type their password
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("client_id", clientId);
    loginUrl.searchParams.set("redirect_uri", redirectUri);
    
    return NextResponse.redirect(loginUrl);

  } catch (error) {
    console.error("Authorize Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}