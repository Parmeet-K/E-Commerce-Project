const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Sale = require("../models/Sale");
const asyncHandler = require("../utils/asyncHandler");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { items, address } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "At least one item is required" });
    }

    if (!address?.trim()) {
      return res.status(400).json({ error: "Shipping address is required" });
    }

    const normalizedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const productId = item.productId || item._id || item.id;
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "Invalid product id in order items" });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: `Product not found for item ${item.name || productId}` });
      }

      const qty = Math.max(Number(item.qty) || 0, 0);
      if (qty < 1) {
        return res.status(400).json({ error: "Each item quantity must be at least 1" });
      }

      if (product.stock < qty) {
        return res.status(400).json({ error: `${product.name} has insufficient stock` });
      }

      const unitPrice = product.discountPrice || product.price;
      totalAmount += unitPrice * qty;

      normalizedItems.push({
        product,
        productId: product._id,
        name: product.name,
        price: unitPrice,
        qty,
      });
    }

    const orderId = `ORD-${Date.now()}`;

    for (const item of normalizedItems) {
      item.product.stock -= item.qty;
      item.product.salesCount += item.qty;
      await item.product.save();

      await Sale.create({
        productId: item.productId,
        quantity: item.qty,
        unitPrice: item.price,
        totalAmount: item.price * item.qty,
        soldBy: req.user._id,
      });
    }

    const order = await Order.create({
      orderId,
      userId: req.user._id,
      items: normalizedItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      address,
      totalAmount: Number(totalAmount.toFixed(2)),
    });

    res.status(201).json(order);
  })
);

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  })
);

router.patch(
  "/:orderId/cancel",
  requireAuth,
  asyncHandler(async (req, res) => {
    const order = await Order.findOne({ orderId: req.params.orderId, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = "cancelled";
    await order.save();

    res.json(order);
  })
);

module.exports = router;
