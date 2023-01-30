const express = require("express");
const { body, param } = require("express-validator");
const controller = require("../controller/seller.controller.js");
const { authorizeRoles } = require("../util/middlewares/auth.js");

const router = new express.Router();

const {
  requestValidator,
} = require("../util/middlewares/express-validator.js");

router.get("/", async (req, res) => {
  res.send({
    message: "Shop API",
    success: true,
  });
});

router.post(
  "/shop",
  [
    body("name", "Invalid Name").isLength({ min: 1 }),
    body("businessName", "Invalid Business Name").isLength({ min: 1 }),
    body("image", "Invalid image").isLength({ min: 1 }),
    body("bannerImage", "Invalid bannerImage").isLength({ min: 1 }),
    body("address", "Invalid address").isLength({ min: 1 }),
    body("city", "Invalid city").isLength({ min: 1 }),
    body("locationName", "Invalid locationName").isLength({ min: 1 }),
    body("location", "Invalid location").isArray().optional(),
    body("description", "Invalid description").isLength({ min: 5, max: 1000 }),
  ],
  requestValidator,
  authorizeRoles("admin", "seller"),
  controller.createShop
);

router.get(
  "/shop/:id",
  [param("id", "Invalid seller id").isMongoId(), requestValidator],
  authorizeRoles("admin", "seller"),
  controller.getShop
);

router.get(
  "/shops",
  authorizeRoles("admin", "seller"),
  controller.getShops
);

module.exports = router;
