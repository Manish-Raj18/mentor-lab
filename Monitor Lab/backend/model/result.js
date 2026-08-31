import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MockTest",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  answers: [
    {
      questionIndex: Number,
      selectedOption: Number,
      isCorrect: Boolean,
      correctAnswer: String,
      selectedAnswer: String,
    },
  ],
  score: {
    type: Number,
    required: true,
  },
  maxScore: {
    type: Number,
    required: true,
  },
  attempted: {
    type: Number,
    default: 0,
  },
  correct: {
    type: Number,
    default: 0,
  },
  wrong: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Result", resultSchema);
