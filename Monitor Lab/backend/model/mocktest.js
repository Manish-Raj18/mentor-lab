// models/MockTest.js
import mongoose from "mongoose";

const mockTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subject: String,
  topic: String,
  duration: Number, // minutes
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const MockTest = mongoose.models.MockTest || mongoose.model("MockTest", mockTestSchema);
export default MockTest;