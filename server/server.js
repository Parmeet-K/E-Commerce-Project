require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const { ensureSeedData } = require("./utils/seedData");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "E-Commerce Product Catalog Management System",
    status: "running",
    features: [
      "product-management",
      "category-management",
      "advanced-search",
      "user-reviews",
      "inventory-management",
      "aggregation-reports",
      "auth-rbac",
    ],
  });
});

app.use("/auth", require("./routes/authRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/categories", require("./routes/categoryRoutes"));
app.use("/reviews", require("./routes/reviewRoutes"));
app.use("/sales", require("./routes/saleRoutes"));
app.use("/orders", require("./routes/orderRoutes"));

app.use((error, req, res, next) => {
  if (error?.code === 11000) {
    return res.status(409).json({ error: "Duplicate value", details: error.keyValue });
  }

  console.error(error);
  return res.status(error.status || 500).json({
    error: error.message || "Internal server error",
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    await ensureSeedData();
    console.log(`MongoDB connected: ${MONGODB_URI}`);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed", error.message);
    process.exit(1);
  });
