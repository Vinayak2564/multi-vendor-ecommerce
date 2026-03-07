const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyToken = require("../middleware/verifyToken");


const safeHandler = (fn) => {
  return typeof fn === "function"
    ? fn
    : (req, res) =>
        res.status(500).json({
          message: "Controller function not implemented properly",
        });
};
// create orders //
router.post(
  "/",
  verifyToken,
  safeHandler(orderController.createOrder)
);

// get customer orders //
const { protect } = require("../middleware/authMiddleware");

router.get("/my-orders", protect, orderController.getMyOrders);




// get all orders //
router.get(
  "/all",
  verifyToken,
  safeHandler(orderController.getAllOrders)
);

// update order update //
router.put(
  "/:id/status",
  verifyToken,
  safeHandler(orderController.updateOrderStatus)
);

//update payment status //
router.put(
  "/:id/payment",
  verifyToken,
  safeHandler(orderController.updatePaymentStatus)
);

// cancel order //
router.put(
  "/:id/cancel",
  verifyToken,
  safeHandler(orderController.cancelOrder)
);

// download invoice //
router.get(
  "/:id/invoice",
  verifyToken,
  safeHandler(orderController.downloadInvoice)
);

// delete order //
router.delete(
  "/:id",
  verifyToken,
  safeHandler(orderController.deleteOrder)
);

module.exports = router;