const express = require("express");
const { body } = require("express-validator");
const controller = require("../controller/account.controller.js");
const {
  requestValidator,
} = require("../util/middlewares/express-validator.js");

const router = new express.Router();

// User Routes
router.post(
  "/verify",
  [body("phone").isLength({ min: 13, max: 13 }), requestValidator],
  controller.verify
);

router.post(
  "/login",
  [
    body("verifyId").isMongoId(),
    body("otp").isLength({ min: 4 }),
    body("phone").isMobilePhone(),
    requestValidator,
  ],
  controller.login
);

module.exports = router;
