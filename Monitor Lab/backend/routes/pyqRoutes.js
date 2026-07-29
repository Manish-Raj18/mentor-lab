import express from "express";
import multer from "multer";
import PYQ from "../model/pyq.js";

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

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.universityId) filter.universityId = req.query.universityId;
    if (req.query.course) filter.course = req.query.course;
    if (req.query.subject) filter.subject = req.query.subject;
    const pyqs = await PYQ.find(filter);
    res.json(pyqs);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
