import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { dbConnect } from "../../../../lib/db/connect";
import { Client } from "../../../../models/Client";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { appName, redirectUris } = body;

    // 1. Generate secure, random credentials
    const clientId = crypto.randomBytes(16).toString("hex");
    const clientSecretPlain = crypto.randomBytes(32).toString("base64url");

    // 2. Hash the secret before saving (CRITICAL SECURITY STEP)
    const saltRounds = 10;
    const clientSecretHash = await bcrypt.hash(clientSecretPlain, saltRounds);

    // 3. Save to database
    const newClient = await Client.create({
      appName,
      clientId,
      clientSecret: clientSecretHash,
      redirectUris,
    });

    // 4. Return the PLAINTEXT secret only once. 
    // We cannot retrieve it later because we only stored the hash!
    return NextResponse.json({
      message: "Client App Registered Successfully",
      client: {
        appName: newClient.appName,
        clientId: newClient.clientId,
        redirectUris: newClient.redirectUris,
      },
      clientSecret: clientSecretPlain, // ⚠️ Emphasize to the user they must copy this now
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}