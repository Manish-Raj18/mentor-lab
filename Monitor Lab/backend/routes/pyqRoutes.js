import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoose from "mongoose";
import PYQ from "../model/pyq.js";
import { protect } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "..", "uploads");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const getBucket = () =>
  new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "pyqs" });

router.post("/upload", protect, upload.single("pdf"), async (req, res) => {
  try {
    const { universityId, universityName, course, subject } = req.body;
    const uploadStream = getBucket().openUploadStream(req.file.originalname, {
      metadata: { universityName, course, subject },
    });

    await new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
      uploadStream.end(req.file.buffer);
    });

    const pyq = new PYQ({
      universityId,
      universityName,
      course,
      subject,
      fileId: uploadStream.id,
    });
    await pyq.save();
    res.status(201).json(pyq);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id/pdf", async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);
    if (!pyq) {
      return res.status(404).json({ message: "PYQ not found" });
    }

    res.set("Content-Type", "application/pdf");
    res.set("Content-Disposition", "inline");

    if (pyq.fileId) {
      const downloadStream = getBucket().openDownloadStream(pyq.fileId);
      downloadStream.on("error", () => {
        if (!res.headersSent) {
          res.status(404).json({ message: "File not found" });
        } else {
          res.destroy();
        }
      });
      downloadStream.pipe(res);
    } else if (pyq.pdfUrl) {
      res.sendFile(path.join(uploadDir, pyq.pdfUrl));
    } else {
      res.status(404).json({ message: "File not found" });
    }
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

    if (pyq.fileId) {
      try {
        await getBucket().delete(pyq.fileId);
      } catch (err) {
        // ignore if the file is already missing
      }
    } else if (pyq.pdfUrl) {
      const filePath = path.join(uploadDir, pyq.pdfUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
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
