/* eslint-disable require-jsdoc */
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
require("colors");

mongoose.set("strictQuery", true);

const Product = require("../../db/model/Product.js");
const dataPath = path.join(__filename, "../../../_data/product.mock.json");
const products = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// const mongoURL = process.env.DB_URL;
const mongoURL = "mongodb://0.0.0.0:27017/Ecommerce-Backend";

async function importData() {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    for (let index = 0; index < products.length; index++) {
      const p = products[index];
      await Product.create({
        name: p.name,
        description: p.description,
        brandInfo: p.brandInfo,
        primaryColor: p.primaryColor,
        gender: p.gender,
        category: p.category,
        isWearAndReturnEnabled: p.isWearAndReturnEnabled,
        mrp: p.mrp,
        price: p.price,
        stock: p.stock,
        inventory: p.inventory,
      });
    }

    const count = await Product.countDocuments();
    if (Number(count) === 0 || Number(count) !== products.length) {
      console.log("Error while importing data".red.inverse);
      return process.exit(0);
    }

    console.log("Data Imported...".green.inverse);
    return process.exit(0);
  } catch (error) {
    console.log("Error while importing data".red.inverse);
    process.exit(0);
  }
}

async function deleteData() {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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
