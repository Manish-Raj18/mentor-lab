import express from "express";
import User from "../model/user.js";
import Course from "../model/course.js";
import Notes from "../model/notes.js";
import Lecture from "../model/lecture.js";
import MockTest from "../model/mocktest.js";
import Purchase from "../model/purchase.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/purchases", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Only admins can view purchases" });
    }
    const purchases = await Purchase.find()
      .populate("userId", "name email")
      .populate("testId", "title subject price")
      .sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/purchase/manual", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Only admins can unlock mock tests" });
    }
    const { userId, testId } = req.body;
    if (!userId || !testId) {
      return res.status(400).json({ message: "userId and testId are required" });
    }
    const test = await MockTest.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Mock test not found" });
    }
    const purchase = await Purchase.findOneAndUpdate(
      { userId, testId },
      { userId, testId, status: "manual", amount: test.price || 0, orderId: "manual", paymentId: "manual" },
      { upsert: true, new: true }
    );
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/purchase/confirm", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Only admins can confirm payments" });
    }
    const { purchaseId } = req.body;
    if (!purchaseId) {
      return res.status(400).json({ message: "purchaseId is required" });
    }
    const purchase = await Purchase.findByIdAndUpdate(
      purchaseId,
      { status: "simulated" },
      { new: true }
    );
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const totalStudents = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalNotes = await Notes.countDocuments();
    const totalLectures = await Lecture.countDocuments();
    const totalTests = await MockTest.countDocuments();

    const tests = await MockTest.find().select("title subject topic questions duration createdAt");
    const subjectBreakdown = {};
    tests.forEach(t => {
      const s = t.subject || "Uncategorized";
      if (!subjectBreakdown[s]) subjectBreakdown[s] = { tests: 0, questions: 0 };
      subjectBreakdown[s].tests += 1;
      subjectBreakdown[s].questions += (t.questions || []).length;
    });

    const monthlyRegistrations = await User.aggregate([
      { $match: { isAdmin: false } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const months = [];
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const found = monthlyRegistrations.find(r => r._id === key);
      months.push({ month: monthNames[d.getMonth()], students: found ? found.count : 0 });
    }

    const totalQuestions = tests.reduce((sum, t) => sum + (t.questions || []).length, 0);

    res.json({
      totalStudents,
      totalCourses,
      totalNotes,
      totalLectures,
      totalTests,
      totalQuestions,
      subjectBreakdown: Object.entries(subjectBreakdown).map(([name, data]) => ({ name, ...data })),
      registrationTrend: months,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find().select("title");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/courses", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Course title is required" });
    const exists = await Course.findOne({ title });
    if (exists) return res.status(400).json({ message: "Course already exists" });
    const course = await Course.create({ title, description });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ isAdmin: false }).select("name email studentId createdAt");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
