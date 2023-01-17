/* eslint-disable require-jsdoc */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("colors");

const User = require("../../db/model/User.js");

// Warning's = false
mongoose.set("strictQuery", true);

// Read User data from user.mock.json file
const dataPath = path.join(__filename, "../../../_data/user.mock.json");
const users = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// Connect mongoose
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

// Create Users
async function importData() {
  try {
    users.map(async (p, index) => {
      new User({ p }).save();

      if (index === users.length - 1) {
        console.log("Data Imported...".green.inverse);
        process.exit(1);
      }
    });
  } catch (error) {
    console.log("Error while importing data".red.inverse);
  }
}

// Delete All Users
async function deleteData() {
  try {
    await User.deleteMany();
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
