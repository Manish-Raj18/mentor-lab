import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    title: String,
    description: String,
});
export default mongoose.model("Result", resultSchema);