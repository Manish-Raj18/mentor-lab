import mongoose from "mongoose";

const pyqSchema = new mongoose.Schema({
  universityId: String,
  universityName: String,
  course: String,
  subject: String,
  pdfUrl: String,
});

export default mongoose.model("PYQ", pyqSchema);
