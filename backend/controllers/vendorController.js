const mongoose = require("mongoose");
const Order = require("../models/Order");


// get vendor orders //
exports.getVendorOrders = async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const orders = await Order.find({
      vendor: req.user._id,
      paymentStatus: "paid",
    })
      .populate("product", "name price")
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// update order statys //
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({
        message: "Cannot update unpaid order",
      });
    }

    const validTransitions = {
      pending: ["processing", "cancelled"],
      accepted: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    const currentStatus = order.status;

    if (!validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${currentStatus} to ${status}`,
      });
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order updated 🚚",
      order,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// earning vendor //
exports.getVendorEarnings = async (req, res) => {
  try {

    const vendorId = new mongoose.Types.ObjectId(req.user._id);

    const stats = await Order.aggregate([
      {
        $match: {
          vendor: vendorId,
          paymentStatus: "paid",
          status: "delivered"  
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" }
        }
      }
    ]);

    const totalOrders = stats.length > 0 ? stats[0].totalOrders : 0;
    const totalRevenue = stats.length > 0 ? stats[0].totalRevenue : 0;

    const totalCommission = totalRevenue * 0.10;
    const totalEarnings = totalRevenue - totalCommission;

    res.set("Cache-Control", "no-store");

    res.json({
      totalOrders,
      totalRevenue,
      totalCommission,
      totalEarnings
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch earnings",
    });
  }
};



// vendor dashboard //
exports.getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const Order = require("../models/Order");
    const User = require("../models/user");

    const orders = await Order.find({ vendor: vendorId });

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    const commissionRate = 0.10; 

    const totalCommission = totalRevenue * commissionRate;

    const totalEarnings = totalRevenue - totalCommission;

    const recentOrders = orders
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    
    const vendor = await User.findById(vendorId);

    res.json({
      totalOrders,
      totalRevenue,
      totalCommission,
      totalEarnings,
      walletBalance: vendor.walletBalance || 0, 
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Withdrawal = require("../models/Withdrawal");


// withdrawl request //
exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;

    const User = require("../models/user");

    if (req.user.role !== "vendor") {
      return res.status(403).json({
        message: "Only vendors can request withdrawals",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid withdrawal amount",
      });
    }

    const vendor = await User.findById(req.user._id);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    //  Check wallet balance //
    if (vendor.walletBalance < amount) {
      return res.status(400).json({
        message: "Insufficient wallet balance",
      });
    }

    //  Check pending withdrawal //
    const existingPending = await Withdrawal.findOne({
      vendor: req.user._id,
      status: "pending",
    });

    if (existingPending) {
      return res.status(400).json({
        message: "You already have a pending withdrawal request",
      });
    }

    const withdrawal = await Withdrawal.create({
      vendor: req.user._id,
      amount,
      status: "pending",
    });

    res.status(201).json({
      message: "Withdrawal request submitted successfully",
      withdrawal,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// vendor withdrawals history //
exports.getVendorWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({
      vendor: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};