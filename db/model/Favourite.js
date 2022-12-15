const mongoose = require("mongoose");
const neatMongoose = require("../../util/mongoose-neat.js");

const favoriteSchema = new mongoose.Schema({
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
});

favoriteSchema.methods.toJSON = neatMongoose;

module.exports = mongoose.model("Favorite", favoriteSchema, "Favorite");
