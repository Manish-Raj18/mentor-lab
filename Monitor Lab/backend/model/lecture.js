import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    title: String,
    description: String,
});
export default mongoose.model("Lecture", lectureSchema);