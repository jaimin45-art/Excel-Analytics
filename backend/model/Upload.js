// server/models/Upload.js
import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fileName: String,
  uploadDate: { type: Date, default: Date.now },
  preview: Array // first few rows
});

export default mongoose.model("Upload", uploadSchema);
