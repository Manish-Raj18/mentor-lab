// routes/mockTestRoutes.js

import express from "express";
import multer from "multer";
import { createRequire } from "module";
import fs from "fs";
import MockTest from "../model/mocktest.js";
import { protect } from "../middleware/authMiddleware.js";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const router = express.Router();

// Multer config for PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Helper function to parse questions from text
const parseQuestions = (text) => {
  const questions = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let currentQuestion = null;

  lines.forEach(line => {
    const qMatch = line.match(/^(\d+)[\.\)]\s+(.*)/);
    if (qMatch) {
      if (currentQuestion) questions.push(currentQuestion);
      currentQuestion = {
        question: qMatch[2],
        options: [],
        correctAnswer: ""
      };
      return;
    }

    const oMatch = line.match(/^[A-Da-d][\.\)]\s+(.*)/);
    if (oMatch && currentQuestion) {
      currentQuestion.options.push(oMatch[1]);
      return;
    }

    const aMatch = line.match(/^(Ans|Answer|Correct)[:\s]+([A-Da-d]|\w+)/i);
    if (aMatch && currentQuestion) {
      const ansVal = aMatch[2].toUpperCase();
      if (ansVal.length === 1 && "ABCD".includes(ansVal)) {
        const idx = "ABCD".indexOf(ansVal);
        if (currentQuestion.options[idx]) {
          currentQuestion.correctAnswer = currentQuestion.options[idx];
        } else {
          currentQuestion.correctAnswer = ansVal;
        }
      } else {
        currentQuestion.correctAnswer = aMatch[2];
      }
      return;
    }

    if (currentQuestion) {
      if (currentQuestion.options.length === 0) {
        currentQuestion.question += " " + line;
      } else {
        const lastIdx = currentQuestion.options.length - 1;
        currentQuestion.options[lastIdx] += " " + line;
      }
    }
  });

  if (currentQuestion) questions.push(currentQuestion);
  return questions;
};

// Add Mock Test via PDF Upload (Admin only)
router.post("/upload-pdf", protect, upload.single("pdf"), async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Only admins can upload mock tests" });
    }
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    
    const questions = parseQuestions(data.text);
    
    if (questions.length === 0) {
      return res.status(400).json({ message: "No questions could be parsed from the PDF. Please check the format." });
    }

    const newTest = new MockTest({
      title: req.body.title || req.file.originalname.replace(".pdf", ""),
      subject: req.body.subject,
      topic: req.body.topic,
      duration: req.body.duration || 60,
      questions: questions
    });

    await newTest.save();
    res.status(201).json(newTest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Add Mock Test Manually (Admin only)
router.post("/add", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Only admins can add mock tests" });
    }
    const test = await MockTest.create(req.body);
    res.status(201).json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Mock Tests (Authenticated users)
router.get("/", protect, async (req, res) => {
  try {
    const tests = await MockTest.find().select("-questions.correctAnswer");
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Single Mock Test by ID (Authenticated users, correctAnswer hidden)
router.get("/:id", protect, async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id).select("-questions.correctAnswer");
    if (!test) {
      return res.status(404).json({ message: "Mock test not found" });
    }
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit Test Result (Authenticated users)
router.post("/:id/submit", protect, async (req, res) => {
  try {
    const { answers, score, attempted, correct, wrong } = req.body;
    const test = await MockTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Mock test not found" });
    }

    let computedCorrect = 0;
    let computedWrong = 0;
    test.questions.forEach((q, idx) => {
      if (answers[idx] !== undefined) {
        if (q.options[answers[idx]] === q.correctAnswer) {
          computedCorrect++;
        } else {
          computedWrong++;
        }
      }
    });

    const computedScore = (computedCorrect * 4) - (computedWrong * 1);

    res.json({
      testId: test._id,
      title: test.title,
      attempted,
      correct: computedCorrect,
      wrong: computedWrong,
      score: computedScore,
      totalQuestions: test.questions.length,
      maxScore: test.questions.length * 4
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;