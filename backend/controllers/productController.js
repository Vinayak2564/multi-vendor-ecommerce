const Product = require("../models/Product");


// ADD PRODUCT //

const addProduct = async (req, res) => {
  try {
    const { name, price, category, description, stock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    const product = new Product({
      name,
      price,
      category,
      description,
      stock,
      vendor: req.user._id, // 🔥 secure
      image: req.file ? `uploads/${req.file.filename}` : "",
    });

    await product.save();

    res.status(201).json({
      message: "Product added successfully ✅",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET ALL PRODUCTS (Search + Filter + Pagination) //

const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, page = 1, limit = 8 } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const count = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("vendor", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(count / limit),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET SINGLE PRODUCT //

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("vendor", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET VENDOR PRODUCTS //

const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({
      vendor: req.params.vendorId,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE PRODUCT //

const updateProduct = async (req, res) => {
  try {
    const { name, price, category, description, stock } = req.body;

    let updateData = {
      name,
      price,
      category,
      description,
      stock,
    };

    if (req.file) {
      updateData.image = `uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated ✅",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE PRODUCT //

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


//  PRODUCT REVIEW //

const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        message: "Rating and comment are required",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prevent duplicate review //
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      rating: product.rating,
      numReviews: product.numReviews,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getSingleProduct,
  getVendorProducts,
  updateProduct,
  deleteProduct,
  addProductReview,
};