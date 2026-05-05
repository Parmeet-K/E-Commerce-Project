const mongoose = require("mongoose");
const Product = require("./Product");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

async function updateProductRating(productId) {
  const stats = await mongoose.model("Review").aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const summary = stats[0] || { averageRating: 0, reviewCount: 0 };

  await Product.findByIdAndUpdate(productId, {
    averageRating: Number(Number(summary.averageRating || 0).toFixed(1)),
    reviewCount: summary.reviewCount,
  });
}

reviewSchema.post("save", function syncRating() {
  return updateProductRating(this.productId);
});

reviewSchema.post("findOneAndUpdate", async function syncUpdatedRating(doc) {
  if (doc) {
    await updateProductRating(doc.productId);
  }
});

reviewSchema.post("findOneAndDelete", async function syncRating(doc) {
  if (doc) {
    await updateProductRating(doc.productId);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
