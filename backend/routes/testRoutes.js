const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");

router.get(
  "/vendor",
  protect,
  authorize("vendor"),
  (req, res) => {
    res.json({ message: "Vendor access granted" });
  }
);

router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

module.exports = router;
