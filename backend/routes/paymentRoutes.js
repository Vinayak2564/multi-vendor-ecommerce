const express = require("express");
const router = express.Router();

const {
  dummyPayment,
} = require("../controllers/paymentController");

// Test route
router.get("/test", (req, res) => {
  res.send("Payment route working ✅");
});

// Dummy payment route
router.post("/dummy-pay", dummyPayment);

module.exports = router;
