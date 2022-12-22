const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },
    // cloudinary
    avatar: {
      public_id: {
        type: String,
        default: "default ID",
      },
      url: {
        type: String,
        default: "default URL",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },
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

sellerSchema.index({ name: 1 }, { sparse: true });
sellerSchema.index({ email: 1 }, { unique: true, sparse: true });

sellerSchema.index(
  { name: "text", email: "text" },
  { weights: { name: 10, username: 6 } },
  { collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.model("Seller", sellerSchema, "Seller");