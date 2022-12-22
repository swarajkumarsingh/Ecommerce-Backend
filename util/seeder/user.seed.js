/* eslint-disable require-jsdoc */
const User = require("../../db/model/User.js");
const mongoose = require("mongoose");
const users = require("../../_data/user.mock.js");
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

// Read JSON files
// ...
async function importData() {
  try {
    users.map(async (p, index) => {
      await User.create(p);
      if (index === users.length - 1) {
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
