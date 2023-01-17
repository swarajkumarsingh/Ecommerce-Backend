const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    size: { type: String, required: true },
    count: { type: Number, default: 1 },
  },
  {
    timestamps: true,
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

cartSchema.index({ userId: 1, productId: 1 }, { unique: true });
module.exports = mongoose.model("Cart", cartSchema, "Cart");
