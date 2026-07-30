// routes/mockTestRoutes.js

import express from "express";
import multer from "multer";
import { createRequire } from "module";
import fs from "fs";
import MockTest from "../model/mocktest.js";
import { protect } from "../middleware/authMiddleware.js";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

const router = express.Router();

// Multer config for PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, Date.now() + "-" + safeName);
  },
});
const upload = multer({ storage });

// Helper function to parse questions from text
const parseQuestions = (text) => {
  const questions = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let currentQuestion = null;

  const extractOptionsFromLine = (line) => {
    const matches = [];
    const regex = /\(?([A-Da-d])\)?[\.\)]\s+/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
      matches.push({ index: match.index, matchLen: match[0].length, letter: match[1].toUpperCase() });
    }
    if (matches.length > 1) {
      for (let i = 0; i < matches.length; i++) {
        const start = matches[i].index + matches[i].matchLen;
        const end = i + 1 < matches.length ? matches[i + 1].index : line.length;
        matches[i].text = line.substring(start, end).trim();
      }
      return matches.map(m => m.text);
    }
    return null;
  };

  lines.forEach(line => {
    const qMatch = line.match(/^(?:Q)?(\d+)[\.\)]\s+(.*)/i);
    if (qMatch) {
      if (currentQuestion) questions.push(currentQuestion);
      currentQuestion = {
        question: qMatch[2],
        options: [],
        correctAnswer: ""
      };
      return;
    }

    if (currentQuestion && currentQuestion.options.length < 4) {
      const multiOpts = extractOptionsFromLine(line);
      if (multiOpts) {
        currentQuestion.options.push(...multiOpts);
        return;
      }
    }

    const oMatch = line.match(/^\(?([A-Da-d])\)?[\.\)]\s+(.*)/);
    if (oMatch && currentQuestion) {
      currentQuestion.options.push(oMatch[2]);
      return;
    }

    const aMatch = line.match(/^(?:Ans|Answer|Correct)[:\s]+\(?([A-Da-d])\)?/i);
    if (aMatch && currentQuestion) {
      const ansVal = aMatch[1].toUpperCase();
      const idx = "ABCD".indexOf(ansVal);
      if (idx >= 0 && currentQuestion.options[idx]) {
        currentQuestion.correctAnswer = currentQuestion.options[idx];
      } else {
        currentQuestion.correctAnswer = ansVal;
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
    const arr = new Uint8Array(dataBuffer);
    const parser = new PDFParse(arr);
    await parser.load();
    const result = await parser.getText();
    
    let fullText = "";
    if (result && result.pages) {
      fullText = result.pages.map(p => p.text).join("\n");
    }
    
    const questions = parseQuestions(fullText);
    
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
    const { answers } = req.body;
    const test = await MockTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Mock test not found" });
    }

    let computedAttempted = 0;
    let computedCorrect = 0;
    let computedWrong = 0;
    test.questions.forEach((q, idx) => {
      if (answers[idx] !== undefined) {
        computedAttempted++;
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
      attempted: computedAttempted,
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