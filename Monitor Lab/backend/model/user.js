import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    default: "",
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  phone: {
    type: String,
    default: ""
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
      score: String,
      resultId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Result",
        default: null,
      }
    }
  ]
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);