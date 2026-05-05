const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Sale = require("../models/Sale");
const asyncHandler = require("../utils/asyncHandler");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

function buildProductFilters(query) {
  const filters = {};

  if (query.category) {
    filters.category = query.category;
  }

  if (query.status) {
    filters.status = query.status;
  }

  if (query.brand) {
    filters.brand = new RegExp(query.brand, "i");
  }

  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) {
      filters.price.$gte = Number(query.minPrice);
    }
    if (query.maxPrice) {
      filters.price.$lte = Number(query.maxPrice);
    }
  }

  if (query.inStock === "true") {
    filters.stock = { $gt: 0 };
  }

  if (query.tag) {
    filters.tags = query.tag;
  }

  if (query.q) {
    filters.$text = { $search: query.q };
  }

  return filters;
}

router.post(
  "/",
  requireAuth,
  requireRole("admin", "manager"),
  asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const filters = buildProductFilters(req.query);
    const sort = req.query.sort || "-createdAt";

    const [items, total] = await Promise.all([
      Product.find(filters)
        .populate("category", "name slug")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filters),
    ]);

    res.json({
      items,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  })
);

router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const filters = buildProductFilters(req.query);
    const products = await Product.find(filters)
      .populate("category", "name slug")
      .sort(req.query.q ? { score: { $meta: "textScore" } } : { createdAt: -1 });

    res.json(products);
  })
);

router.get(
  "/low-stock",
  requireAuth,
  requireRole("admin", "manager"),
  asyncHandler(async (req, res) => {
    const products = await Product.find({
      $expr: { $lte: ["$stock", "$lowStockThreshold"] },
      status: { $ne: "archived" },
    }).populate("category", "name slug");

    res.json(products);
  })
);

router.get(
  "/report/category",
  requireAuth,
  requireRole("admin", "manager"),
  asyncHandler(async (req, res) => {
    const report = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          avgPrice: { $avg: "$price" },
          totalInventoryValue: { $sum: { $multiply: ["$price", "$stock"] } },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          categoryName: { $ifNull: [{ $arrayElemAt: ["$category.name", 0] }, "Uncategorized"] },
          totalProducts: 1,
          totalStock: 1,
          avgPrice: { $round: ["$avgPrice", 2] },
          totalInventoryValue: { $round: ["$totalInventoryValue", 2] },
        },
      },
      { $sort: { totalProducts: -1 } },
    ]);

    res.json(report);
  })
);

router.get(
  "/report/inventory",
  requireAuth,
  requireRole("admin", "manager"),
  asyncHandler(async (req, res) => {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: {
              $cond: [{ $eq: ["$status", "active"] }, 1, 0],
            },
          },
          totalUnitsInStock: { $sum: "$stock" },
          totalInventoryValue: { $sum: { $multiply: ["$price", "$stock"] } },
          outOfStockProducts: {
            $sum: {
              $cond: [{ $eq: ["$stock", 0] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalProducts: 1,
          activeProducts: 1,
          totalUnitsInStock: 1,
          totalInventoryValue: { $round: ["$totalInventoryValue", 2] },
          outOfStockProducts: 1,
        },
      },
    ]);

    res.json(summary[0] || {});
  })
);

router.get(
  "/report/sales",
  requireAuth,
  requireRole("admin", "manager"),
  asyncHandler(async (req, res) => {
    const match = {};
    if (req.query.startDate || req.query.endDate) {
      match.soldAt = {};
      if (req.query.startDate) {
        match.soldAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        match.soldAt.$lte = new Date(req.query.endDate);
      }
    }

    const report = await Sale.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$productId",
          totalOrders: { $sum: 1 },
          unitsSold: { $sum: "$quantity" },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: { $arrayElemAt: ["$product.name", 0] },
          sku: { $arrayElemAt: ["$product.sku", 0] },
          totalOrders: 1,
          unitsSold: 1,
          revenue: { $round: ["$revenue", 2] },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json(report);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const product = await Product.findById(req.params.id).populate("category", "name slug");
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  })
);

router.put(
  "/:id",
  requireAuth,
  requireRole("admin", "manager"),
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  })
);

router.patch(
  "/:id/stock",
  requireAuth,
  requireRole("admin", "manager"),
  asyncHandler(async (req, res) => {
    const { stock, lowStockThreshold } = req.body;
    const update = {};

    if (typeof stock === "number") {
      update.stock = stock;
    }
    if (typeof lowStockThreshold === "number") {
      update.lowStockThreshold = lowStockThreshold;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      product,
      lowStockAlert: product.stock <= product.lowStockThreshold,
    });
  })
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  })
);

module.exports = router;
