import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Notes from "../model/notes.js";
import { protect } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "..", "uploads");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const getBucket = () =>
  new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "pdfs" });

router.post("/upload", protect, upload.single("pdf"), async (req, res) => {
  try {
    const { title, description, course, subject } = req.body;
    const bucket = getBucket();

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: { title, course, subject },
    });

    await new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
      uploadStream.end(req.file.buffer);
    });

    const note = new Notes({
      title,
      description,
      course,
      subject,
      fileId: uploadStream.id,
    });

    await note.save();

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.course) filter.course = req.query.course;
    if (req.query.subject) filter.subject = req.query.subject;
    const notes = await Notes.find(filter);

    res.json(notes);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id/pdf", async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.set("Content-Type", "application/pdf");
    res.set("Content-Disposition", "inline");

    if (note.fileId) {
      const downloadStream = getBucket().openDownloadStream(note.fileId);
      downloadStream.on("error", () => {
        if (!res.headersSent) {
          res.status(404).json({ message: "File not found" });
        } else {
          res.destroy();
        }
      });
      downloadStream.pipe(res);
    } else if (note.pdfUrl) {
      res.sendFile(path.join(uploadDir, note.pdfUrl));
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.fileId) {
      try {
        await getBucket().delete(note.fileId);
      } catch (err) {
        // ignore if the file is already missing
      }
    } else if (note.pdfUrl) {
      const filePath = path.join(uploadDir, note.pdfUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Notes.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
