// routes/mockTestRoutes.js

import express from "express";
import multer from "multer";
import { createRequire } from "module";
import fs from "fs";
import crypto from "crypto";
import MockTest from "../model/mocktest.js";
import Result from "../model/result.js";
import Purchase from "../model/purchase.js";
import { protect } from "../middleware/authMiddleware.js";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");
const Razorpay = require("razorpay");

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

const hasRazorpayKeys =
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET &&
  !process.env.RAZORPAY_KEY_ID.startsWith("YOUR_") &&
  !process.env.RAZORPAY_KEY_SECRET.startsWith("YOUR_");

const razorpay = hasRazorpayKeys
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

const hasAccess = async (userId, test) => {
  if (!test) return false;
  const price = test.price || 0;
  if (price <= 0) return true;
  const purchase = await Purchase.findOne({ userId, testId: test._id });
  return Boolean(purchase);
};

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
      price: req.body.price || 0,
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
    const purchases = await Purchase.find({ userId: req.user._id }).select("testId status");
    const purchasedIds = new Set(purchases.map(p => p.testId.toString()));
    const result = tests.map(t => ({
      ...t.toObject(),
      price: t.price || 0,
      purchased: (t.price || 0) <= 0 || purchasedIds.has(t._id.toString()),
      paymentPending: false,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all results for logged-in user (for Profile page) - MUST be before /:id
router.get("/results/mine", protect, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select("-answers");
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single result with full review data (Authenticated users) - MUST be before /:id
router.get("/result/:resultId", protect, async (req, res) => {
  try {
    const result = await Result.findOne({
      _id: req.params.resultId,
      userId: req.user._id,
    });
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    const test = await MockTest.findById(result.testId);
    if (!test) {
      return res.status(404).json({ message: "Original test not found" });
    }

    const questions = test.questions.map((q, idx) => ({
      questionIndex: idx,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    }));

    res.json({
      result,
      questions,
    });
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
    if (!(await hasAccess(req.user._id, test))) {
      return res.status(403).json({ message: "Please purchase this mock test to access it" });
    }
    res.json({ ...test.toObject(), purchased: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Razorpay order for a paid test
router.post("/:id/order", protect, async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Mock test not found" });
    }
    const price = test.price || 0;
    if (price <= 0) {
      return res.json({ free: true, purchased: true, testId: test._id });
    }
    if (await hasAccess(req.user._id, test)) {
      return res.json({ purchased: true, testId: test._id });
    }
    if (!razorpay) {
      return res.json({
        simulate: true,
        amount: price,
        currency: "INR",
        testId: test._id,
      });
    }

    const order = await razorpay.orders.create({
      amount: price * 100,
      currency: "INR",
      receipt: `test_${test._id}_${req.user._id}`,
      notes: { testId: test._id.toString(), userId: req.user._id.toString() },
    });

    res.json({
      orderId: order.id,
      amount: price,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      testId: test._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Manual UPI payment confirmation (auto-unlocks once student submits a real UPI transaction reference)
router.post("/:id/simulate-pay", protect, async (req, res) => {
  try {
    if (hasRazorpayKeys) {
      return res.status(403).json({ message: "Real Razorpay keys are configured — use real payment" });
    }
    const test = await MockTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Mock test not found" });
    }
    if (await hasAccess(req.user._id, test)) {
      return res.json({ purchased: true, testId: test._id });
    }
    const price = test.price || 0;
    const transactionId = (req.body?.transactionId || "").trim();
    if (price > 0 && !transactionId) {
      return res.status(400).json({ message: "UPI Transaction ID (UTR) required to confirm payment" });
    }
    const purchase = await Purchase.findOneAndUpdate(
      { userId: req.user._id, testId: test._id },
      {
        userId: req.user._id,
        testId: test._id,
        amount: price,
        status: "simulated",
        orderId: "sim_" + crypto.randomUUID(),
        paymentId: transactionId || "sim_" + crypto.randomUUID(),
      },
      { upsert: true, new: true }
    );
    res.json({ success: true, purchased: true, testId: test._id, purchase });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Verify Razorpay payment and record purchase
router.post("/:id/verify", protect, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const test = await MockTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Mock test not found" });
    }
    const price = test.price || 0;

    if (price > 0) {
      if (!process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ message: "Razorpay is not configured on the server" });
      }
      if (!orderId || !paymentId || !signature) {
        return res.status(400).json({ message: "Missing payment details" });
      }
      const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");
      if (expected !== signature) {
        return res.status(400).json({ message: "Payment verification failed" });
      }
    }

    const purchase = await Purchase.findOneAndUpdate(
      { userId: req.user._id, testId: test._id },
      {
        userId: req.user._id,
        testId: test._id,
        orderId,
        paymentId,
        amount: price,
        status: "paid",
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, testId: test._id, purchase });
  } catch (err) {
    console.error(err);
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
    if (!(await hasAccess(req.user._id, test))) {
      return res.status(403).json({ message: "Please purchase this mock test to submit" });
    }

    let computedAttempted = 0;
    let computedCorrect = 0;
    let computedWrong = 0;
    const detailedAnswers = [];

    test.questions.forEach((q, idx) => {
      if (answers[idx] !== undefined) {
        computedAttempted++;
        const selectedAnswer = q.options[answers[idx]];
        const isCorrect = selectedAnswer === q.correctAnswer;
        if (isCorrect) {
          computedCorrect++;
        } else {
          computedWrong++;
        }
        detailedAnswers.push({
          questionIndex: idx,
          selectedOption: answers[idx],
          isCorrect,
          correctAnswer: q.correctAnswer,
          selectedAnswer,
        });
      } else {
        detailedAnswers.push({
          questionIndex: idx,
          selectedOption: -1,
          isCorrect: false,
          correctAnswer: q.correctAnswer,
          selectedAnswer: null,
        });
      }
    });

    const computedScore = (computedCorrect * 4) - (computedWrong * 1);

    const savedResult = await Result.create({
      userId: req.user._id,
      testId: test._id,
      title: test.title,
      answers: detailedAnswers,
      score: computedScore,
      maxScore: test.questions.length * 4,
      attempted: computedAttempted,
      correct: computedCorrect,
      wrong: computedWrong,
    });

    res.json({
      resultId: savedResult._id,
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