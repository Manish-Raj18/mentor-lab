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

    res.json({
      totalStudents,
      totalCourses,
      totalNotes,
      totalLectures,
      totalTests,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;