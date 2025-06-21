const express = require("express");
const { body, validationResult } = require("express-validator");
const Product = require("../models/Product");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ name: 1 });
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new product
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("slug").notEmpty().withMessage("Product slug is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, slug } = req.body;

      // Check if product already exists
      const existingProduct = await Product.findOne({
        $or: [
          { name, isActive: true },
          { slug, isActive: true },
        ],
      });

      if (existingProduct) {
        return res
          .status(400)
          .json({ message: "Product name or slug already exists" });
      }

      const product = new Product({
        name,
        description,
        slug,
      });

      await product.save();
      res.status(201).json(product);
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update product
router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("slug").notEmpty().withMessage("Product slug is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, slug } = req.body;

      // Check if product exists
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if updated name or slug conflicts with existing product
      const existingProduct = await Product.findOne({
        _id: { $ne: req.params.id },
        $or: [
          { name, isActive: true },
          { slug, isActive: true },
        ],
      });

      if (existingProduct) {
        return res
          .status(400)
          .json({ message: "Product name or slug already exists" });
      }

      product.name = name;
      product.description = description;
      product.slug = slug;
      await product.save();

      res.json(product);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete product (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
