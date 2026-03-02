const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // customer //
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //vendor //
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // product //
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    //order details //
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    // price //
    productPrice: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    // delivery address //
    deliveryAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    

    // order status //
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // payment //
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    transactionId: {
      type: String,
      default: null,
    },

    //earning s //
    vendorEarning: {
      type: Number,
      default: 0,
    },

    adminCommission: {
      type: Number,
      default: 0,
    },

    refundStatus: {
      type: String,
      enum: ["none", "initiated", "refunded"],
      default: "none",
    },

    isVendorPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Order ||
  mongoose.model("Order", orderSchema);