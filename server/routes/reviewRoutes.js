const express = require("express");
const Product = require("../models/Product");
const Review = require("../models/Review");
const asyncHandler = require("../utils/asyncHandler");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { productId, rating, title, comment, verifiedPurchase } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const review = await Review.findOneAndUpdate(
      { productId, userId: req.user._id },
      {
        productId,
        userId: req.user._id,
        rating,
        title,
        comment,
        verifiedPurchase: Boolean(verifiedPurchase),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(201).json(review);
  })
);

router.get(
  "/product/:productId",
  asyncHandler(async (req, res) => {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate("userId", "name role")
      .sort({ createdAt: -1 });

    res.json(reviews);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const canDelete = req.user.role === "admin" || review.userId.toString() === req.user._id.toString();
    if (!canDelete) {
      return res.status(403).json({ error: "Access denied" });
    }

    await Review.findOneAndDelete({ _id: req.params.id });
    res.json({ message: "Review deleted" });
  })
);

module.exports = router;
