import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  title: String,
  description: String,
  pdfUrl: String,
});

export default mongoose.model("Notes", notesSchema);