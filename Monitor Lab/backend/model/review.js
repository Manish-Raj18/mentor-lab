import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  targetType: {
    type: String,
    required: true,
    enum: ["mentor-lab", "bca", "bba", "biotech", "notes", "lectures", "pyq", "home", "about", "contact", "bca-roadmap", "bba-roadmap", "mock-test", "analytics", "chatbot", "login", "signup", "forgot-password", "admin-login", "admin", "profile"],
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Review", reviewSchema);
