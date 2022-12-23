"use strict";

const express = require("express");
const morgan = require("morgan");
require("dotenv").config({ path: "./env" });

const connectDb = require("./db/connect");
const responseware = require("./util/middlewares/middelwares.js");
const fakeAuthorizer = require("./util/fake-authorizer.js");
const errorMiddleware = require("./util/middlewares/error.js");
const { paginateParams } = require("./util/middlewares/request-sanitize.js");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("common"));
app.use(paginateParams());
app.use(responseware(express));
connectDb();

// Firebase Admin SDK
const firebase = require("firebase-admin");
const serviceAccount = require("./firebase-sdk.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

const userRoute = require("./routes/user.routes.js");
const orderRoute = require("./routes/order.routes.js");
const reviewRoute = require("./routes/review.routes.js");
const productRoute = require("./routes/product.routes.js");
const wishlistRoute = require("./routes/wishlist.routes.js");

app.use(fakeAuthorizer); // Rest all API requires Authentication
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", reviewRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", wishlistRoute);

app.use(errorMiddleware);

module.exports = app;
