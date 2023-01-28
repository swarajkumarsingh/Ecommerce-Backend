const mongoose = require("mongoose");

// const days = 100;

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    uses: { type: Number, default: 0 },
    maxUses: { type: Number, default: 1000 },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
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

couponSchema.index({ code: 1 }, { unique: true, sparse: true });
couponSchema.index({ code: "text" });

module.exports = mongoose.model("Coupon", couponSchema, "Coupon");
