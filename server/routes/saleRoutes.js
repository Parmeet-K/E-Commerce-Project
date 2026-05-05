const express = require("express");
const Product = require("../models/Product");
const Sale = require("../models/Sale");
const asyncHandler = require("../utils/asyncHandler");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRole("admin", "manager"),
  asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    const unitPrice = product.discountPrice || product.price;
    const totalAmount = unitPrice * quantity;

    product.stock -= quantity;
    product.salesCount += quantity;
    await product.save();

    const sale = await Sale.create({
      productId,
      quantity,
      unitPrice,
      totalAmount,
      soldBy: req.user._id,
    });

    res.status(201).json({
      sale,
      lowStockAlert: product.stock <= product.lowStockThreshold,
      remainingStock: product.stock,
    });
  })
);

router.get(
  "/",
  requireAuth,
  requireRole("admin", "manager"),
  asyncHandler(async (req, res) => {
    const sales = await Sale.find()
      .populate("productId", "name sku")
      .populate("soldBy", "name role")
      .sort({ soldAt: -1 });

    res.json(sales);
  })
);

module.exports = router;
