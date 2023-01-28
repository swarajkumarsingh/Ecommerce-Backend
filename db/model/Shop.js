const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    profilePhoto: { type: String, trim: true },
    media: [{ type: String }],

    clothCount: { type: Number, default: 0 },
    listedClothCount: { type: Number, default: 0 },
    visits: { type: Number, default: 0 },
    calls: { type: Number, default: 0 },
    maxPrice: { type: Number, default: 0 },
    minPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    managerId: { type: Schema.Types.ObjectId, ref: "User" },

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
  }
);

storeSchema.index({ location: "2dsphere" });
storeSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Store", storeSchema, "Store");
