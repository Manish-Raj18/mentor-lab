import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    course: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: "",
    },
    studentName: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    studentId: {
      type: String,
      default: "",
    },
    score: {
      type: String,
      default: "",
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Certificate", certificateSchema);