const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promoBannerSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    banners: [
      {
        index: { type: Number },
        image: { type: String },
        link: { type: String },
        type: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PromoBanner",
  promoBannerSchema,
  "PromoBanner"
);
