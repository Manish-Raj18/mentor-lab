import express from "express";
import crypto from "crypto";
import User from "../model/user.js";
import Notes from "../model/notes.js";
import MockTest from "../model/mocktest.js";
import Result from "../model/result.js";
import Certificate from "../model/certificate.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const COURSE_ALIASES = {
  BCA: "BCA",
  BBA: "BBA",
  BIOTECH: "BIOTECH",
  BIOTECHNOLOGY: "BIOTECH",
  BIO: "BIOTECH",
};

const normalizeCourse = (value) => {
  const key = String(value || "").trim().toUpperCase();
  return COURSE_ALIASES[key] || key;
};

const COURSE_PATTERNS = {
  BCA: /BCA/i,
  BBA: /BBA/i,
  BIOTECH: /BIOTECH|BIOTECHNOLOGY|\bBIO\b/i,
};

const generateCertificateId = () => {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `ML-${ymd}-${rand}`;
};

const getCourseProgress = async (userId, course) => {
  const pattern = COURSE_PATTERNS[course] || new RegExp(escapeRegExp(course), "i");
  const [allNotes, allTests, results] = await Promise.all([
    Notes.find({ course: pattern }),
    MockTest.find({ subject: pattern }),
    Result.find({ userId }),
  ]);

  const doneTestIds = new Set(results.map((r) => r.testId.toString()));
  const totalNotes = allNotes.length;
  const totalTests = allTests.length;

  const user = await User.findById(userId);
  const readSet = new Set((user.readNotes || []).map((n) => n.toString()));
  const readNotes = allNotes.filter((n) => readSet.has(n._id.toString())).length;
  const doneTests = allTests.filter((t) => doneTestIds.has(t._id.toString())).length;

  const hasContent = totalNotes + totalTests > 0;
  const complete = hasContent && readNotes === totalNotes && doneTests === totalTests;

  return {
    course,
    totalNotes,
    readNotes,
    totalTests,
    doneTests,
    complete,
  };
};

const escapeRegExp = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Mark a study note as read by the logged-in user
router.post("/notes/:id/read", protect, async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { readNotes: note._id },
    });

    res.json({ message: "Note marked as read", noteId: note._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get progress for a course + issue certificate when complete
router.get("/progress/:course", protect, async (req, res) => {
  try {
    const course = normalizeCourse(req.params.course);
    const progress = await getCourseProgress(req.user._id, course);
    const certificate = await Certificate.findOne({ userId: req.user._id, course });

    if (progress.complete && !certificate) {
      const cert = await Certificate.create({
        userId: req.user._id,
        certificateId: generateCertificateId(),
        course,
        studentName: req.user.name,
        college: req.user.college || "",
        phone: req.user.phone || "",
        email: req.user.email || "",
        studentId: req.user.studentId || "",
      });
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { certificates: cert._id },
      });
      res.json({ ...progress, certificate: cert });
    } else {
      res.json({ ...progress, certificate });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all certificates for the logged-in user
router.get("/mine", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("certificates");
    res.json(user.certificates || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single certificate by id
router.get("/:id", protect, async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.json(certificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;