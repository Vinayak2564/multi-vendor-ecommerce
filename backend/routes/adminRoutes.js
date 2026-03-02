const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getAllProducts,
  getAllOrders,
  getAdminStats,
  getMonthlySales,
  getLowStockProducts,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Testing  routes //
router.get("/", (req, res) =>
  res.json({ message: "Admin route working ✅" })
);

// api's //
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/products", protect, adminOnly, getAllProducts);
router.get("/orders", protect, adminOnly, getAllOrders);
router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/sales/monthly", protect, adminOnly, getMonthlySales);
router.get("/low-stock", protect, adminOnly, getLowStockProducts);

// withdrawal management //
router.get("/withdrawals", protect, adminOnly, getAllWithdrawals);
router.put("/withdrawal/:id/approve", protect, adminOnly, approveWithdrawal);
router.put("/withdrawal/:id/reject", protect, adminOnly, rejectWithdrawal);

// delete product//
router.delete("/products/:id", protect, adminOnly, async (req, res) => {
  try {
    const Product = require("../models/Product");
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted successfully ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete user //
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// update order //
router.put("/order/:id", protect, adminOnly, async (req, res) => {
  try {
    const Order = require("../models/Order");
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || order.status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;