const mongoose = require("mongoose");
const neatMongoose = require("../../util/mongoose-neat.js");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
  },
  address: [
    {
      type: String,
      minLength: [4, "Address should be greater than 6 characters"],
    },
  ],
  avatar: {
    public_id: {
      type: String,
      required: true,
      default: "default ID",
    },
    url: {
      type: String,
      required: true,
      default: "default URL",
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdOn: { type: Date, default: Date.now },
});

userSchema.methods.toJSON = neatMongoose;

module.exports = mongoose.model("User", userSchema, "User");
