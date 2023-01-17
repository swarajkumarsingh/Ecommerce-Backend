const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentActivitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    transactionAmount: { type: Number, required: true },
    transactionType: { type: String, required: true }, // CREDIT, DEBIT
    closingBalance: { type: Number, required: true },
    contentBold: { type: String, default: "", trim: true },
    contentPlain: { type: String, default: "", trim: true },
    image: { type: String, required: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    metaData: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PaymentActivity",
  paymentActivitySchema,
  "PaymentActivity"
);