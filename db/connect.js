const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.Promise = global.Promise;

// TODO: Change Mongo URI ( URI Exposed in Github )
// const mongoURL = process.env.DB_URL;

const mongoURL = "mongodb://localhost:27017/Ecommerce-Backend";

let isConnected;
let isDbConnectionRequested = false;

module.exports = connectToDatabase = async () => {
  if (isConnected) {
    console.log("=> using existing database connection");
    return Promise.resolve();
  }

  if (isDbConnectionRequested) {
    // Avoids New Connected Requested from Every other file.
    console.log("=> database connection Already requested");
    return Promise.resolve();
  }
  console.log("=> using new database connection");
  isDbConnectionRequested = true;
  return mongoose
    .connect(mongoURL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then((db) => {
      isConnected = db.connections[0].readyState;
      console.log(`Connected to DB`);
      return Promise.resolve();
    })
    .catch((err) => {
      console.log(`Error connecting DB`, err);
      return process.exit(1)
    });
};
