const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    processedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Withdrawal ||
  mongoose.model("Withdrawal", withdrawalSchema);