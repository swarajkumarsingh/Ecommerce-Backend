const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const { verifyIdToken } = require("../login");

module.exports.apiKeyAuthenticator = async (req, res, next) => {
  if (!req.headers || !("x-api-key" in req.headers)) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.X_API_KEY) {
    return res.status(401).json({
      message: "Invalid API key",
    });
  }
  next();
};

/**
 * Checks if token was created from same firebase app
 * and if token is valid.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

module.exports.firebaseUserAuthenticator = async (req, res, next) => {
  if (!req.headers || !("token" in req.headers)) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  const token = req.headers.token;
  const tokenResponse = await verifyIdToken(token);
  if (
    !tokenResponse ||
    !("user_id" in tokenResponse) ||
    !mongoose.Types.ObjectId.isValid(tokenResponse.user_id)
  ) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
  req.userId = tokenResponse.user_id;
  next();
};
