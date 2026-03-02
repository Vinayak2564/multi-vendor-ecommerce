const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const Order = require("../models/Order");
const Product = require("../models/Product");


// create orders //
exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId, quantity = 1, deliveryAddress } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID missing" });
    }

    const product = await Product.findById(productId).session(session);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Only ${product.stock} items available in stock`,
      });
    }

    if (
      !deliveryAddress?.fullName ||
      !deliveryAddress?.phone ||
      !deliveryAddress?.address ||
      !deliveryAddress?.city ||
      !deliveryAddress?.state ||
      !deliveryAddress?.pincode
    ) {
      return res.status(400).json({
        message: "Complete delivery address required",
      });
    }

    const productPrice = product.price;
    const totalPrice = productPrice * quantity;

    product.stock -= quantity;
    await product.save({ session });

    const order = await Order.create(
      [
        {
          customer: req.user.id,
          vendor: product.vendor,
          product: productId,
          quantity,
          productPrice,
          totalPrice,
          deliveryAddress,
          paymentStatus: "pending",
          status: "pending",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Order placed successfully",
      order: order[0],
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error" });
  }
};


//invoice //
exports.downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("product")
      .populate("customer", "name email")
      .populate("vendor", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // allows for only admin,vendor,and customer //
    if (
      order.customer._id.toString() !== req.user.id &&
      order.vendor._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // only paid orders //
    if (order.paymentStatus !== "paid") {
      return res.status(400).json({
        message: "Invoice available only for paid orders",
      });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Title //
    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Date: ${order.createdAt.toDateString()}`);
    doc.moveDown();

    doc.text(`Customer: ${order.customer.name}`);
    doc.text(`Customer Email: ${order.customer.email}`);
    doc.moveDown();

    doc.text(`Vendor: ${order.vendor.name}`);
    doc.text(`Vendor Email: ${order.vendor.email}`);
    doc.moveDown();

    doc.text(`Product: ${order.product.name}`);
    doc.text(`Quantity: ${order.quantity}`);
    doc.text(`Price per unit: ₹${order.productPrice}`);
    doc.text(`Total: ₹${order.totalPrice}`);
    doc.moveDown();

    doc.text(`Admin Commission: ₹${order.adminCommission}`);
    doc.text(`Vendor Earning: ₹${order.vendorEarning}`);
    doc.moveDown();

    doc.text("Thank you for your purchase!", { align: "center" });

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




// update payment status //
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, transactionId } = req.body;

    const User = require("../models/user");

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // cancels double credit cards //
    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Payment already processed",
      });
    }

    order.paymentStatus = paymentStatus;
    order.transactionId = transactionId;

    if (paymentStatus === "paid") {
      const adminCommission = order.totalPrice * 0.1;
      const vendorEarning = order.totalPrice - adminCommission;

      order.adminCommission = adminCommission;
      order.vendorEarning = vendorEarning;

      // vendor wallet //
      const vendor = await User.findById(order.vendor);

      if (vendor) {
        vendor.walletBalance += vendorEarning;
        await vendor.save();
      }
    }

    await order.save();

    res.json({
      message: "Payment updated successfully",
      order,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET my orders //
exports.getMyOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const orders = await Order.find({
      customer: req.user.id,   
    })
      .populate("product")
      .populate("vendor", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.error("Get My Orders Error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// cancel order //
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only customer can cancel //
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Prevent cancel if already shipped or delivered //
    if (order.status === "shipped" || order.status === "delivered") {
      return res.status(400).json({
        message: "Order cannot be cancelled after shipping",
      });
    }

    order.status = "cancelled";

    // Restore stock //
    const product = await Product.findById(order.product);
    if (product) {
      product.stock += order.quantity;
      await product.save();
    }

    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};