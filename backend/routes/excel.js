import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/verifyToken.js";
import { uploadExcel, getHistory, getHistoryDataById } from "../controllers/excel-controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", verifyToken, upload.single("file"), uploadExcel);
router.get("/history", verifyToken, getHistory);
router.get("/history/:id/data", verifyToken, getHistoryDataById);

export default router;
