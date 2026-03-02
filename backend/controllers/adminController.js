

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Get all users //
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
// Get all products //
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
// Get all orders//
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
// Admin stats//
const getAdminStats = async (req, res) => {
  try {
    //  Users //
    const totalUsers = await User.countDocuments();
    const totalVendors = await User.countDocuments({ role: "vendor" });
    const totalCustomers = await User.countDocuments({ role: "customer" });

    //  Orders (only delivered for revenue accuracy) //
    const deliveredOrders = await Order.find({ status: "delivered" });

    const totalOrders = deliveredOrders.length;

    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    //  Commission (10%)//
    const commissionRate = 0.10;
    const totalCommission = totalRevenue * commissionRate;

    //  Pending Withdrawals //
    const pendingWithdrawals = await Withdrawal.find({
      status: "pending",
    });

    const pendingWithdrawalAmount = pendingWithdrawals.reduce(
      (sum, w) => sum + w.amount,
      0
    );

    res.json({
      totalUsers,
      totalVendors,
      totalCustomers,
      totalOrders,
      totalRevenue,
      totalCommission,
      pendingWithdrawalAmount,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Monthly sales //
const getMonthlySales = async (req, res) => {
  try {
    const monthlySales = await Order.aggregate([
      { $match: { status: "delivered" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    const formatted = monthlySales.map(item => ({
      month: monthNames[item._id - 1],
      revenue: item.revenue,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Low stock //
const getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } });
    res.json(lowStockProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const Withdrawal = require("../models/Withdrawal");

//  GET ALL WITHDRAWALS //
const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("vendor", "name email")
      .sort({ createdAt: -1 });

    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Aproving withdrawals // 
const approveWithdrawal = async (req, res) => {
  try {
    const Withdrawal = require("../models/Withdrawal");
    const User = require("../models/User");

    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({
        message: "This withdrawal has already been processed",
      });
    }

    const vendor = await User.findById(withdrawal.vendor);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    //  Check wallet balance //
    if (vendor.walletBalance < withdrawal.amount) {
      return res.status(400).json({
        message: "Insufficient vendor wallet balance",
      });
    }

    //  reduce wallet balance //
    vendor.walletBalance -= withdrawal.amount;
    await vendor.save();

    //  Update withdrawal after reduce //
    withdrawal.status = "approved";
    withdrawal.processedAt = new Date();
    await withdrawal.save();

    res.json({
      message: "Withdrawal approved successfully ✅",
      withdrawal,
      updatedWalletBalance: vendor.walletBalance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//  rejecting withdrawals // 
const rejectWithdrawal = async (req, res) => {
  try {
    const Withdrawal = require("../models/Withdrawal");

    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({
        message: "This withdrawal has already been processed",
      });
    }

    withdrawal.status = "rejected";
    withdrawal.processedAt = new Date();
    await withdrawal.save();

    res.json({
      message: "Withdrawal rejected",
      withdrawal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllProducts,
  getAllOrders,
  getAdminStats,
  getMonthlySales,
  getLowStockProducts,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
};