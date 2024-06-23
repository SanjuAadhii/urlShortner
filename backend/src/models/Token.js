import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: { type: String, required: true },
  type: { type: String, required: true, enum: ["activation", "reset"] },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // Token expiration set to 1 hour
});

export default mongoose.model("Token", TokenSchema);
