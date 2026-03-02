const express = require("express");
const router = express.Router();

const {
  getVendorOrders,
  updateOrderStatus,
  getVendorDashboard,
  requestWithdrawal,
  getVendorWithdrawals,
} = require("../controllers/vendorController");

const { protect } = require("../middleware/authMiddleware");


router.get("/orders", protect, getVendorOrders);


router.put("/orders/:orderId", protect, updateOrderStatus);


router.get("/dashboard", protect, getVendorDashboard);

router.post("/withdrawal", protect, requestWithdrawal);


router.get("/withdrawals", protect, getVendorWithdrawals);

router.get("/wallet", protect, async (req, res) => {
  try {
    res.json({ walletBalance: req.user.walletBalance || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;