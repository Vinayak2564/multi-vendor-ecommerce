const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");

const {
  addProduct,
  getProducts,
  getSingleProduct,
  getVendorProducts,
  updateProduct,
  deleteProduct,
  addProductReview,
} = require("../controllers/productController");

// =======================================================
// ADD PRODUCT (Protected Vendor)
// =======================================================
router.post("/add", protect, upload.single("image"), addProduct);

// =======================================================
// GET ALL PRODUCTS
// =======================================================
router.get("/", getProducts);

// =======================================================
// GET VENDOR PRODUCTS (⚠ must be before :id route)
// =======================================================
router.get("/vendor/:vendorId", getVendorProducts);

// =======================================================
// ADD PRODUCT REVIEW (Protected Customer)
// =======================================================
router.post("/:id/reviews", protect, addProductReview);

// =======================================================
// GET SINGLE PRODUCT
// =======================================================
router.get("/:id", getSingleProduct);

// =======================================================
// UPDATE PRODUCT (Protected)
// =======================================================
router.put("/:id", protect, upload.single("image"), updateProduct);

// =======================================================
// DELETE PRODUCT (Protected)
// =======================================================
router.delete("/:id", protect, deleteProduct);

module.exports = router;