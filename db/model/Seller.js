const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    bannerImage: { type: String, trim: true },
    address: { type: String, trim: true, unique: true },
    city: { type: String, trim: true },

    minimumDressPrice: { type: Number, default: 0 },
    maximumDressPrice: { type: Number, default: 0 },

    locationName: { type: String, trim: true },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    productCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

sellerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Seller", sellerSchema, "Seller");
