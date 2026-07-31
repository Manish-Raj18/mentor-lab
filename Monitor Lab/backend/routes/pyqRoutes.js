import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import PYQ from "../model/pyq.js";
import { protect } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "..", "uploads");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, Date.now() + "-" + safeName);
  },
});

const upload = multer({ storage });

router.post("/upload", protect, upload.single("pdf"), async (req, res) => {
  try {
    const pyq = new PYQ({
      universityId: req.body.universityId,
      universityName: req.body.universityName,
      course: req.body.course,
      subject: req.body.subject,
      pdfUrl: req.file.filename,
    });
    await pyq.save();
    res.status(201).json(pyq);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);
    if (!pyq) {
      return res.status(404).json({ message: "PYQ not found" });
    }
    const filePath = path.join(uploadDir, pyq.pdfUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await PYQ.findByIdAndDelete(req.params.id);
    res.json({ message: "PYQ deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const filter = {};
    const caseInsensitive = (v) => ({ $regex: new RegExp(`^${v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").trim()}$`, "i") });
    if (req.query.universityId) filter.universityId = caseInsensitive(req.query.universityId);
    if (req.query.course) filter.course = caseInsensitive(req.query.course);
    if (req.query.subject) filter.subject = caseInsensitive(req.query.subject);
    const pyqs = await PYQ.find(filter);
    res.json(pyqs);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
