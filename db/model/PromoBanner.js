const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promoBannerSchema = new Schema(
  {
    // key: 'home_top_banner' key: 'search_home_bottom_banner'
    key: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    // Contact Us
    name: { type: String, required: true, trim: true },
    // About banner
    description: { type: String, required: true, trim: true },
    // index - ranking
    // image - image of banner
    // link - onCLick link
    // type - what type of banner
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
    toObject: {
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

promoBannerSchema.index({ key: 1 }, { sparse: true });
promoBannerSchema.index({ key: "text" });

module.exports = mongoose.model(
  "PromoBanner",
  promoBannerSchema,
  "PromoBanner"
);
