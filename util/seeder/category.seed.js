/* eslint-disable require-jsdoc */
const Category = require("../db/model/Category.js");
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
require("colors");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__filename, "../../_data/category.mock.json");

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

const categories = JSON.parse(fs.readFileSync(dataPath, "utf8"));

async function importData() {
  try {
    categories.map(async (p, index) => {
      new Category({ p }).save();
      if (index === categories.length - 1) {
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
    await Category.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.log("Error while deleting data".red.inverse);
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
