"use strict";

const cors = require("cors");
const morgan = require("morgan");
const express = require("express");

require("dotenv").config({ path: "./env" });
const fakeAuthorizer = require("./util/fake-authorizer.js");

const connectDb = require("./db/connect.js");
const responseware = require("./util/middlewares/middelwares.js");
const { paginateParams } = require("./util/middlewares/request-sanitize.js");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("common"));
app.use(paginateParams());
app.use(responseware(express));
connectDb();

// Firebase Admin SDK
const firebase = require("firebase-admin");
const serviceAccount = require("./firebase_sdk.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

const userRoute = require("./routes/user.routes.js");
const cartRoute = require("./routes/cart.routes.js");
const orderRoute = require("./routes/order.routes.js");
const reviewRoute = require("./routes/review.routes.js");
const accountRoute = require("./routes/account.routes.js");
const productRoute = require("./routes/product.routes.js");
const wishlistRoute = require("./routes/wishlist.routes.js");

app.use(fakeAuthorizer); // All Rest APIs require Authentication

// app.use(apiKeyAuthenticator); // Adds API key validation to APIs
app.use("/account", accountRoute);
// app.use(firebaseUserAuthenticator); // Get userID from token
app.use("/api/v1", userRoute);
app.use("/api/v1", cartRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", reviewRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", wishlistRoute);

module.exports = app;
