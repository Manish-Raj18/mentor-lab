import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  title: String,
  description: String,
  course: String,
  subject: String,
  fileId: mongoose.Schema.Types.ObjectId,
  pdfUrl: String,
});

export default mongoose.model("Notes", notesSchema);
