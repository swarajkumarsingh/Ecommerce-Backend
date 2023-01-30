/* eslint-disable require-jsdoc */
const Product = require("../../db/model/Product.js");
const mongoose = require("mongoose");
// const connectToDatabase = require("../../db/connect.js")
mongoose.set("strictQuery", true);
require("colors");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__filename, "../../../_data/product.mock.json");

const products = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// mongoose
//   .connect("mongodb://localhost:27017/Ecommerce-Backend", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .catch((err) => {
//     console.log(err.stack);
//     process.exit(1);
//   })
//   .then(() => {});

async function dB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/Ecommerce-Backend");
  } catch (error) {
    console.log(":(", error);
  }
}

dB();

async function importData() {
  try {
    products.map(async (p, index) => {
      // await Product.create({p})
      new Product({
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
      })
        .save()
        .then(async () => {
          const pDucts = await Product.countDocuments();
          if (Number(pDucts) > 0) {
            console.log("Data Imported...".green.inverse);
            process.exit(1);
          } else {
            console.log("Unexpected error occurred :(".red.inverse);
            process.exit(0);
          }
        });
    });
  } catch (error) {
    console.log(error);
    console.log("Error while importing data".red.inverse);
    process.exit(0);
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
