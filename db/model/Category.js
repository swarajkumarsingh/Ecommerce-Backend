const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    gender: { type: String, default: "unisex" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    itemCount: { type: Number, default: 0 },
    parentId: { type: Schema.Types.ObjectId, ref: "Category" },
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

categorySchema.index({ name: 1 }, { sparse: true });
categorySchema.index({ name: "text" });

module.exports = mongoose.model("Category", categorySchema, "Category");
