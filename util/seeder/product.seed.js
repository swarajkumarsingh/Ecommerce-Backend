/* eslint-disable require-jsdoc */
const Product = require("../../db/model/Product.js");
const mongoose = require("mongoose");
// const products = require("../../_data/product.mock.js");
mongoose.set("strictQuery", true);
require("colors");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__filename, "../../../_data/product.mock.json");

const products = JSON.parse(fs.readFileSync(dataPath, "utf8"));

async function importData() {
  try {
    products.map(async (p, index) => {
      new Product({p}).save();
      if (index === products.length - 1) {
        console.log("Data Imported...".green.inverse);
        process.exit(1);
      }
    });
  } catch (error) {
    console.log("Error while importing data".red.inverse);
  }
}

async function deleteData() {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err.red.inverse);
    process.exit();
  }
}
// Setting flag for running the function
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else {
  console.log("No flag found".red.inverse);
  process.exit(0);
}
