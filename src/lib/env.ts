import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required")
    .startsWith("mongodb", "Must be a valid MongoDB URI"),
});

export function getEnv() {
  const envParsed = envSchema.safeParse({
    MONGODB_URI: process.env.MONGODB_URI, // ✅ FIXED
  });

  if (!envParsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      envParsed.error.format()
    );
    throw new Error("Invalid environment variables");
  }

  return envParsed.data;
}