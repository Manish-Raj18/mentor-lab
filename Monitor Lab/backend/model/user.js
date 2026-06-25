import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  // New fields for dynamic profile
  studentId: {
    type: String,
    default: ""
  },
  performanceStats: {
    type: Object,
    default: {
      testsTaken: 0,
      avgScore: "0%",
      rank: "N/A",
      hoursLearnt: "0h"
    }
  },
  recentActivity: [
    {
      title: String,
      date: Date,
      score: String
    }
  ]
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);