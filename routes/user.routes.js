const express = require("express");
const router = new express.Router();
const { body } = require("express-validator");

const controller = require("../controller/user.controller.js");
const {
  requestValidator,
} = require("../util/middlewares/express-validator.js");

router.get("/", async (req, res) => {
  res.send({
    message: "User API",
    success: true,
  });
});

router.post(
  "/user/new",
  [
    body("name", "Invalid Name").isLength({ min: 3, max: 100 }),
    body("password", "Invalid Password").isLength({ min: 8, max: 100 }),
    body("email", "Invalid email").optional().isEmail(),
    body("address", "Invalid address")
      .optional()
      .isLength({ min: 6, max: 200 }),
  ],
  requestValidator,
  controller.createUser
);

module.exports = router;
