const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    princeMinus: { type: Number, required: true },
    createdOn: { type: Number, default: Date.now },
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

module.exports = mongoose.model("Coupon", couponSchema, "Coupon");
