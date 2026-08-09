import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { PDFParse } from "pdf-parse";
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
    const { title, description, course, subject, content } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!req.file && !content) {
      return res.status(400).json({ message: "Provide a PDF file or note content" });
    }

    if (!req.file) {
      const note = new Notes({
        title,
        description,
        course,
        subject,
        content,
        hasContent: !!content,
        type: "web",
      });
      await note.save();
      return res.status(201).json(note);
    }

    const extractedText = await extractPdfText(req.file.buffer);

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
      content: content || extractedText || undefined,
      hasContent: !!(content || extractedText),
      type: "pdf",
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
    const notes = await Notes.find(filter).select("-content");

    res.json(notes);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Lazy extraction: convert older PDF notes to web pages on first view
    if (!note.content && note.fileId) {
      try {
        const chunks = [];
        const downloadStream = getBucket().openDownloadStream(note.fileId);
        for await (const chunk of downloadStream) chunks.push(chunk);
        const text = await extractPdfText(Buffer.concat(chunks));
        if (text) {
          note.content = text;
          note.hasContent = true;
          await note.save();
        }
      } catch (error) {
        console.error("Lazy PDF extraction failed:", error.message);
      }
    }

    res.json(note);
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

async function extractPdfText(buffer) {
  try {
    const parser = new PDFParse(new Uint8Array(buffer));
    await parser.load();
    const result = await parser.getText();
    const text = (result.pages || []).map((p) => p.text || "").join("\n");
    return text.trim() || "";
  } catch (error) {
    console.error("PDF text extraction failed:", error.message);
    return "";
  }
}

export default router;
