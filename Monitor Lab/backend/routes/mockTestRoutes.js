// routes/mockTestRoutes.js

import express from "express";
import multer from "multer";
import { createRequire } from "module";
import fs from "fs";
import MockTest from "../model/mocktest.js";

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
  // Basic regex to find questions starting with a number like "1. Question text"
  // and options like "A) Option A" or "(a) Option a"
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let currentQuestion = null;

  lines.forEach(line => {
    // Check if line starts with a number followed by . or ) (e.g., "1.", "1)")
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

    // Check for options (A, B, C, D or a, b, c, d followed by . or ))
    const oMatch = line.match(/^[A-Da-d][\.\)]\s+(.*)/);
    if (oMatch && currentQuestion) {
      currentQuestion.options.push(oMatch[1]);
      return;
    }

    // Check for Answer key (e.g., "Ans: A" or "Correct: Option")
    const aMatch = line.match(/^(Ans|Answer|Correct)[:\s]+([A-Da-d]|\w+)/i);
    if (aMatch && currentQuestion) {
      const ansVal = aMatch[2].toUpperCase();
      // If it's a single letter A-D, map it to the option index
      if (ansVal.length === 1 && "ABCD".includes(ansVal)) {
        const idx = "ABCD".indexOf(ansVal);
        if (currentQuestion.options[idx]) {
          currentQuestion.correctAnswer = currentQuestion.options[idx];
        } else {
          currentQuestion.correctAnswer = ansVal; // fallback
        }
      } else {
        currentQuestion.correctAnswer = aMatch[2];
      }
      return;
    }

    // If no match but we have a current question, it might be a multi-line question or option
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

// Add Mock Test via PDF Upload
router.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  try {
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
    
    // Optionally remove file after processing
    // fs.unlinkSync(req.file.path);

    res.status(201).json(newTest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Add Mock Test Manually (Existing)
router.post("/add", async (req, res) => {
  try {
    const test = await MockTest.create(req.body);
    res.status(201).json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Mock Tests
router.get("/", async (req, res) => {
  const tests = await MockTest.find();
  res.json(tests);
});

export default router;