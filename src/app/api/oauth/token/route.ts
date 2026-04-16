import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // 👈 Import bcrypt
import { dbConnect } from "@/lib/db/connect";
import { User } from "@/models/User";
import { Client } from "@/models/Client"; // 👈 Import your Client model

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { grant_type, client_id, client_secret, code } = body;

    // 1. Strict Parameter Checks
    if (grant_type !== "authorization_code" || !client_id || !client_secret || !code) {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
    }

    await dbConnect();

    // 2. The Proper Client Authentication Flow
    const clientApp = await Client.findOne({ clientId: client_id });
    if (!clientApp) {
      return NextResponse.json({ error: "Invalid Client ID" }, { status: 401 });
    }

    // 🔒 Cryptography Check: Compare the incoming plain-text secret against the DB hash
    const isSecretValid = await bcrypt.compare(client_secret, clientApp.clientSecret);
    if (!isSecretValid) {
      return NextResponse.json({ error: "Unauthorized: Invalid Client Secret" }, { status: 401 });
    }

    // 3. User Authorization Check (The Code)
    const user = await User.findOne({ authorizationCode: code });
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired authorization code" }, { status: 401 });
    }

    // 4. Build the JWT Payload
    const payload = {
      iss: "http://localhost:3000",
      aud: client_id,
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET is missing");

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    // 5. Security Best Practice: Delete the code
    user.authorizationCode = undefined;
    await user.save();

    return NextResponse.json({
      access_token: token,
      token_type: "Bearer",
      expires_in: 3600
    }, { status: 200 });

  } catch (error) {
    console.error("Token Exchange Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}