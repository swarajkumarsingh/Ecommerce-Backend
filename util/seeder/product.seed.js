/* eslint-disable require-jsdoc */
const Product = require("../../db/model/Product.js");
const mongoose = require("mongoose");
const products = require("../../_data/product.mock.js");
mongoose.set("strictQuery", true);
require("colors");

// connect mongoose
mongoose
  .connect("mongodb://localhost:27017/Ecommerce-Backend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(() => {});

async function importData() {
  try {
    products.map(async (p, index) => {
      await Product.create(p);
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
    console.error(err);
    process.exit();
  }
}
// Setting flag for running the function
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
