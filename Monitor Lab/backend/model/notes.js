import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  title: String,
  description: String,
  course: String,
  subject: String,
  fileId: mongoose.Schema.Types.ObjectId,
  pdfUrl: String,
  content: String,
  hasContent: { type: Boolean, default: false },
  type: { type: String, enum: ["pdf", "web"], default: "pdf" },
});

export default mongoose.model("Notes", notesSchema);
