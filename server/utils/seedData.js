const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");

const seedProducts = [
  { name: "Wireless Headphones", price: 79.99, description: "Premium sound quality", sku: "WH-001", brand: "ShopHub", category: "Audio", stock: 25, tags: ["audio", "wireless"] },
  { name: "Smart Watch", price: 199.99, description: "Track your fitness", sku: "SW-001", brand: "ShopHub", category: "Wearables", stock: 18, tags: ["fitness", "smartwatch"] },
  { name: "USB-C Cable", price: 12.99, description: "Fast charging", sku: "UC-001", brand: "ShopHub", category: "Accessories", stock: 60, tags: ["cable", "charging"] },
  { name: "Portable Charger", price: 34.99, description: "20000mAh capacity", sku: "PC-001", brand: "ShopHub", category: "Accessories", stock: 30, tags: ["battery", "charging"] },
  { name: "Phone Stand", price: 15.99, description: "Adjustable design", sku: "PS-001", brand: "ShopHub", category: "Accessories", stock: 40, tags: ["stand", "desk"] },
  { name: "Screen Protector", price: 9.99, description: "Case friendly", sku: "SP-001", brand: "ShopHub", category: "Accessories", stock: 75, tags: ["screen", "protection"] },
  { name: "Bluetooth Speaker", price: 49.99, description: "360 degree sound", sku: "BS-001", brand: "ShopHub", category: "Audio", stock: 22, tags: ["speaker", "bluetooth"] },
  { name: "Phone Case", price: 19.99, description: "Shockproof", sku: "PHC-001", brand: "ShopHub", category: "Accessories", stock: 50, tags: ["phone", "case"] },
];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function ensureSeedData() {
  const adminEmail = "admin@shophub.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const adminUser = new User({
      name: "Admin User",
      email: adminEmail,
      role: "admin",
    });
    adminUser.setPassword("admin123");
    await adminUser.save();
  }

  const existingProducts = await Product.countDocuments();
  if (existingProducts > 0) {
    return;
  }

  const categoryMap = new Map();

  for (const product of seedProducts) {
    if (!categoryMap.has(product.category)) {
      const categoryDoc = await Category.findOneAndUpdate(
        { slug: slugify(product.category) },
        {
          name: product.category,
          slug: slugify(product.category),
          description: `${product.category} products`,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      categoryMap.set(product.category, categoryDoc);
    }
  }

  await Product.insertMany(
    seedProducts.map((product) => ({
      name: product.name,
      price: product.price,
      description: product.description,
      sku: product.sku,
      brand: product.brand,
      category: categoryMap.get(product.category)._id,
      stock: product.stock,
      tags: product.tags,
      status: "active",
    }))
  );
}

module.exports = {
  ensureSeedData,
};
