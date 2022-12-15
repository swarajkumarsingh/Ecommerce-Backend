const mongoose = require("mongoose");
const neatMongoose = require("../../util/mongoose-neat.js");


const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

reviewSchema.methods.toJSON = neatMongoose;

module.exports = mongoose.model("Review", reviewSchema, "Review");
