import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Setting from "../model/setting.js";
import { protect } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "..", "uploads");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".png";
    cb(null, `qr_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

const getSettings = async () => {
  const doc = await Setting.findOne({ key: "payments" });
  return doc || { upiId: "", phone: "", payeeName: "", qrImage: "" };
};

// Public: payment details shown to students at checkout
router.get("/settings", async (req, res) => {
  try {
    const s = await getSettings();
    res.json({
      upiId: s.upiId || "",
      phone: s.phone || "",
      payeeName: s.payeeName || "",
      qrUrl: s.qrImage ? `/uploads/${s.qrImage}` : "",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get current payment settings
router.get("/settings/admin", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Only admins can view payment settings" });
    }
    const s = await getSettings();
    res.json({
      upiId: s.upiId || "",
      phone: s.phone || "",
      payeeName: s.payeeName || "",
      qrUrl: s.qrImage ? `/uploads/${s.qrImage}` : "",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: save/update payment settings (QR image upload optional)
router.post("/settings/admin", protect, upload.single("qr"), async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Only admins can update payment settings" });
    }
    const current = await getSettings();
    let qrImage = current.qrImage;
    if (req.file) {
      if (current.qrImage) {
        const oldPath = path.join(uploadsDir, current.qrImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      qrImage = req.file.filename;
    }
    const saved = await Setting.findOneAndUpdate(
      { key: "payments" },
      {
        key: "payments",
        upiId: req.body.upiId || "",
        phone: req.body.phone || "",
        payeeName: req.body.payeeName || "",
        qrImage,
      },
      { upsert: true, new: true }
    );
    res.json({
      upiId: saved.upiId,
      phone: saved.phone,
      payeeName: saved.payeeName,
      qrUrl: saved.qrImage ? `/uploads/${saved.qrImage}` : "",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;