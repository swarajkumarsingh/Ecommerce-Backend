const mongoose = require("mongoose");
const neatMongoose = require("../../util/mongoose-neat.js");

const couponSchema = new mongoose.Schema({
  productId: {
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
});

couponSchema.methods.toJSON = neatMongoose;

module.exports = mongoose.model("Favorite", couponSchema, "Favorite");
