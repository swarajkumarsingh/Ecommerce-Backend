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
// const mongoURL = process.env.DB_URL;
const mongoURL = "mongodb://0.0.0.0:27017/Ecommerce-Backend";

// Create Users
async function importData() {
  try {
    await mongoose.connect(
      mongoURL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    for (let index = 0; index < users.length; index++) {
      await User.create({
        name: users[index].name,
        email: users[index].email,
        phone: users[index].phone,
        password: users[index].password,
        fullAddress: users[index].address,
      });
    }

    const count = await User.countDocuments();
    if (Number(count) === 0 || Number(count) !== users.length) {
      console.log("Error while importing data".red.inverse);
      return process.exit(0);
    }

    console.log("Data Imported...".green.inverse);
    return process.exit(0);
  } catch (error) {
    console.log("Error while importing data".red.inverse);
  }
}

// Delete All Users
async function deleteData() {
  try {
    await mongoose.connect(
      mongoURL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
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
