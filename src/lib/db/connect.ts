import mongoose from "mongoose";
import { getEnv } from "../env"; // Import your awesome new function!

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  // ✅ Read AND strictly validate the URL inside the function
  const MONGODB_URI = getEnv().MONGODB_URI; 

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("✅ Successfully connected to MongoDB!");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}