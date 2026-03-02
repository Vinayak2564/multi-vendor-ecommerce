const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;

    const order = await Order.findById(orderId);

    if (!order || order.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({
        message: "You can review only after delivery",
      });
    }

    const existingReview = await Review.findOne({
      product: productId,
      customer: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    const review = await Review.create({
      product: productId,
      customer: req.user.id,
      order: orderId,
      rating,
      comment,
    });

    // Update  rating //
    const reviews = await Review.find({ product: productId });

    const avg =
      reviews.reduce((acc, item) => acc + item.rating, 0) /
      reviews.length;

    const product = await Product.findById(productId);
    product.averageRating = avg;
    product.numReviews = reviews.length;

    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      review,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};