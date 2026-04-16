import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/connect"; // 👈 Much cleaner and safer!
import { User } from "@/models/User";         // 👈 Much cleaner and safer!
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // 1. Grab the data sent from your React form
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // 2. Security Check: Does this email already exist?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    // 3. Cryptography: Salt and Hash the password
    // (10 rounds is the perfect balance of security and speed for Next.js)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Save to Database
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // NEVER save the plain 'password' variable!
    });

    await newUser.save();

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}