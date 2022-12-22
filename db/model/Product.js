// Creating schema and adding creating schema, and passing it to productController

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter product Name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please Enter product description"],
    },
    primaryImage: { type: String, trim: true },
    otherImages: [{ type: String }],
    gender: { type: String, required: true },
    primaryColor: { type: String },
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    ratings: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Please Enter product category"],
    },
    stock: {
      type: Number,
      default: 1,
      required: [true, "Please Enter product Stock"],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    isWearAndReturnEnabled: { type: Boolean, default: false },
    productViewers: {
      user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    },
    brandInfo: { type: mongoose.Schema.Types.Mixed },
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

    createdBy: {
      type: mongoose.Types.ObjectId,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toObject: {
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        if (
          "location" in ret &&
          "type" in ret.location &&
          "coordinates" in ret.location &&
          Array.isArray(ret.location.coordinates) &&
          ret.location.coordinates.length > 1
        ) {
          ret.location = [
            ret.location.coordinates[1],
            ret.location.coordinates[0],
          ];
        }
        return ret;
      },
    },
  }
);

productSchema.index({ name: 1 }, { sparse: true });
productSchema.index({ description: 1 }, { sparse: true });

productSchema.index(
  { name: "text", brandInfo: "text" },
  { weights: { name: 10, brandInfo: 6 } },
  { collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.model("Product", productSchema, "Product");
