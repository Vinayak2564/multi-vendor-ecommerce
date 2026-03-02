const Order = require("../models/Order");
const Product = require("../models/Product");

//  PAYMENT //
exports.dummyPayment = async (req, res) => {
  try {
    console.log("Dummy payment API hit ✅");

    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        message: "orderId and status required",
      });
    }

    // Find order FIRST //
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Generate  transaction id //
    const transactionId =
      "DUMMY_TXN_" + Math.floor(Math.random() * 1000000);

    //  AUTO ORDER STATUS LOGIC //
    let orderStatus = "pending";

    if (status === "paid") {
  orderStatus = "accepted";

  const items = order.orderItems || order.items || [];

  for (let item of items) {
    const productId = item.product || item.productId;
    const quantity = item.quantity || item.qty;

    if (!productId || !quantity) continue;

    const product = await Product.findById(productId);

    if (product) {
      product.stock = Math.max(0, product.stock - quantity);
      await product.save();
    }
  }
}

    if (status === "failed") {
      orderStatus = "cancelled";
    }

    // Update order AFTER stock update //
    order.paymentStatus = status;
    order.transactionId = transactionId;
    order.status = orderStatus;

    await order.save();

    res.json({
      success: true,
      message: "Dummy payment processed ✅",
      order,
    });

  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({
      message: "Payment server error",
    });
  }
};