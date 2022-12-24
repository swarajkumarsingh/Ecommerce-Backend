const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    toObject: {
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

reviewSchema.index({ comment: 1 }, { sparse: true });

reviewSchema.index(
  { comment: "text" },
  { weights: { comment: 10 } },
  { collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.model("Review", reviewSchema, "Review");
