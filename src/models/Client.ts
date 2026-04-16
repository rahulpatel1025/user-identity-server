import mongoose, { Schema, model, models } from "mongoose";

const ClientSchema = new Schema({
  appName: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
    unique: true,
  },
  clientSecret: {
    type: String, // Stored as a hash! Never store plaintext secrets.
    required: true,
  },
  redirectUris: {
    type: [String], // MUST validate exactly where we send the auth code back to
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Client = models.Client || model("Client", ClientSchema);