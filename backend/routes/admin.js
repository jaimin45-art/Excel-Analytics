import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import Upload from "../model/Upload.js";

const router = express.Router();

router.get("/uploads", verifyToken, async (req, res) => {
  try {
    // 🛡️ Check for admin access
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // 📦 Fetch uploads and populate user name
    const uploads = await Upload.find()
      .populate("userId", "name") // Only fetch 'name' from User
      .sort({ uploadDate: -1 });

    // 🧹 Format the uploads
    const formattedUploads = uploads.map(upload => ({
      userId: upload.userId?._id || "N/A",
      userName: upload.userId?.name || "Unknown User",
      fileName: upload.fileName,
      uploadDate: upload.uploadDate,
    }));

    // ✅ Send response
    res.json({ success: true, data: formattedUploads });

  } catch (err) {
    console.error("Admin uploads fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
