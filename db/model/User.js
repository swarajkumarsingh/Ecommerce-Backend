const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    phone: { type: Number, required: true },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: [
      {
        receiverName: { type: String, trim: true },
        area: { type: String, required: true, trim: true },
        houseNumber: { type: String, required: true, trim: true },
        streetName: { type: String, required: true, trim: true },
        fullAddress: { type: String, required: true, trim: true },
        addressType: { type: String, required: true, trim: true }, // HOME, OFFICE, OTHER
        lastUsed: { type: Date, default: Date.now },
        location: {
          type: { type: String, enum: ["Point"], default: "Point" },
          coordinates: { type: [Number], default: [0, 0] },
        },
      },
    ],
    locationName: { type: String, trim: true },
    fullAddress: { type: String, trim: true },
    otherLocationData: { type: mongoose.Schema.Types.Mixed },
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
    coins: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    createdOn: { type: Date, default: Date.now },
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

userSchema.index({ name: 1 }, { sparse: true });
userSchema.index({ email: 1 }, { unique: true, sparse: true });

userSchema.index(
  { name: "text", email: "text" },
  { weights: { name: 10, email: 6 } },
  { collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.model("User", userSchema, "User");
