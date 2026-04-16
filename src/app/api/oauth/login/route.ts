import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/connect";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // 1. Grab the credentials and the OAuth tracking info
    const { email, password, client_id, redirect_uri } = await req.json();

    if (!email || !password || !client_id || !redirect_uri) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    await dbConnect();

    // 2. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Security tip: Always use generic error messages so hackers don't know if an email exists!
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 3. Cryptography check: Compare the typed password to the hashed one in MongoDB
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 4. Success! Generate a secure, one-time Authorization Code
    // (In a production app, we would save this to the database with a 5-minute expiration)
    const authorizationCode = crypto.randomUUID();
    
    // 👇 NEW: Save this exact code to the user's document in MongoDB
    user.authorizationCode = authorizationCode;
    await user.save();
    // 5. Construct the final URL to send the user back to their app
    const returnUrl = new URL(redirect_uri);
    returnUrl.searchParams.set("code", authorizationCode);

    return NextResponse.json({ redirectUrl: returnUrl.toString() }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}