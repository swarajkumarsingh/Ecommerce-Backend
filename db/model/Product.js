// Creating schema and adding creating schema, and passing it to productController

const mongoose = require("mongoose");
const neatMongoose = require("../../util/mongoose-neat.js")

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter product description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter product description"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],

  category: {
    type: String,
    required: [true, "Please Enter product category"],
  },
  Stock: {
    type: Number,
    default: 1,
    required: [true, "Please Enter product Stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index({ name: 1 }, { unique: true, sparse: true });
productSchema.methods.toJSON = neatMongoose;


// creating and exporting the collection Product (sameTime)
module.exports = mongoose.model("Product", productSchema);
