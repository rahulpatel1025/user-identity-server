import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true, // 👇 Added this so we can store the user's Full Name
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String, // We will store the bcrypt hashed password here
    required: true,
  },
  mfaEnabled: {
    type: Boolean,
    default: false,
  },
  authorizationCode: { 
    type: String 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent Mongoose from recompiling the model if it already exists
export const User = models.User || model("User", UserSchema);