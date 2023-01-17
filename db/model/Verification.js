const mongoose = require("mongoose");
const { neatMongoose } = require("../../util/mongoose-neat");
const Schema = mongoose.Schema;

const verificationSchema = new Schema({
  source: { type: String, trim: true, required: true }, // What we will be verifying on ex: phoneNumber
  type: { type: String, default: "phone", enum: ["phone"] },
  otp: { type: String, trim: true, required: true },
  createdOn: { type: Date, default: Date.now },
  expiresOn: { type: Date, default: Date.now, expires: 120 }, // Verification will expire in 120
});

verificationSchema.methods.toJSON = neatMongoose;

module.exports = mongoose.model(
  "Verification",
  verificationSchema,
  "Verification"
);
