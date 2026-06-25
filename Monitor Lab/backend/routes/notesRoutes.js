import express from "express";
import multer from "multer";
import Notes from "../model/notes.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const note = new Notes({
      title: req.body.title,
      description: req.body.description,
      pdfUrl: req.file.filename,
    });

    await note.save();

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const notes = await Notes.find();

    res.json(notes);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;