const mongoose = require("mongoose");
const neatMongoose = require("../../util/mongoose-neat.js");

const couponSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      required: true,
    },
    princeMinus: {
      type: Number,
      ref: "product",
    },
    createdOn: {
      type: Number,
      ref: Date.now,
    },
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

couponSchema.methods.toJSON = neatMongoose;

module.exports = mongoose.model("Favorite", couponSchema, "Favorite");
