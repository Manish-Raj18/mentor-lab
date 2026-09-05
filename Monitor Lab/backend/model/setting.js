import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "payments" },
    upiId: String,
    phone: String,
    payeeName: String,
    qrImage: String,
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model("Setting", settingSchema);