import express from "express";
import User from "../model/user.js";
import Course from "../model/course.js";
import Notes from "../model/notes.js";
import Lecture from "../model/lecture.js";
import MockTest from "../model/mocktest.js";

const router = express.Router();

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

router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ isAdmin: false }).select("name email studentId createdAt");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
