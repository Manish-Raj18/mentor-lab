import mongoose from "mongoose";

const pyqSchema = new mongoose.Schema({
  universityId: String,
  universityName: String,
  course: String,
  subject: String,
  fileId: mongoose.Schema.Types.ObjectId,
  pdfUrl: String,
});

export default mongoose.model("PYQ", pyqSchema);
