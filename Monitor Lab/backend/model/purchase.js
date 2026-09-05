import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MockTest",
      required: true,
    },
    orderId: String,
    paymentId: String,
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["paid", "manual", "simulated", "pending"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

purchaseSchema.index({ userId: 1, testId: 1 }, { unique: true });

const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);

export default Purchase;