const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const reviewController = require("../controllers/reviewController");

router.post("/", protect, reviewController.createReview);

module.exports = router;