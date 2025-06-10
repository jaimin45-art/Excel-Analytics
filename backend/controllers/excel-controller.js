// controllers/excel-controller.js
import XlsxPopulate from "xlsx-populate";
import fs from "fs";
import Upload from "../model/Upload.js";

export const uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = await XlsxPopulate.fromFileAsync(filePath);
    const sheet = workbook.sheet(0);
    const values = sheet.usedRange().value();
    const preview = values.slice(0, 5);

    await Upload.create({
      userId: req.user._id,  // ✅ use ObjectId
      fileName: req.file.originalname,
      preview,
    });

    fs.unlinkSync(filePath);
    res.json({ success: true, data: values });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.user._id })
      .sort({ uploadDate: -1 })
      .limit(5);
    res.json({ success: true, data: uploads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getHistoryDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const upload = await Upload.findById(id);

    if (!upload) {
      return res.status(404).json({ success: false, message: "Upload not found" });
    }

    if (upload.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, data: upload.preview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
