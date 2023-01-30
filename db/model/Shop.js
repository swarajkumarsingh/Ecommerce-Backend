const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    profilePhoto: { type: String, trim: true },
    media: [{ type: String }],

    clothCount: { type: Number, default: 0 },
    listedClothCount: { type: Number, default: 0 },
    maxPrice: { type: Number, default: 0 },
    minPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller" },

    productsSold: [
      {
        productIds: { type: Schema.Types.ObjectId, ref: "Product" },
        customerId: { type: Schema.Types.ObjectId, ref: "User" },
        count: { type: Number },
        productAmount: { type: Number },
        orderId: { type: Schema.Types.ObjectId, ref: "Order" },
      },
    ],

    phoneNumber: { type: String, trim: true },

    isSaleLive: { type: Boolean, default: false },

    area: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: Number },
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
    social: {
      whatsapp: { type: String },
      facebook: { type: String },
      instagram: { type: String },
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
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

storeSchema.index({ location: "2dsphere" });
storeSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Store", storeSchema, "Store");
