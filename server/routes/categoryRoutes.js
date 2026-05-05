const express = require("express");
const Category = require("../models/Category");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRole("admin", "manager"),
  asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const categories = await Category.find().populate("parentCategory", "name slug");
    res.json(categories);
  })
);

router.get(
  "/:id/products",
  asyncHandler(async (req, res) => {
    const products = await Product.find({ category: req.params.id }).populate("category", "name slug");
    res.json(products);
  })
);

router.put(
  "/:id",
  requireAuth,
  requireRole("admin", "manager"),
  asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  })
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted" });
  })
);

module.exports = router;
