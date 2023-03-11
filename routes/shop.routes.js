const express = require("express");
const { body, param } = require("express-validator");
const controller = require("../controller/shop.controller.js");
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
    body("description", "Invalid description").isLength({ min: 5 }).optional(),
    body("sellerId", "Invalid sellerId").isMongoId(),
    body("profilePhoto", "Invalid profilePhoto")
      .isLength({ min: 1 })
      .optional(),
    body("media", "Invalid image").isArray().optional(),
    body("clothCount", "Invalid clothCount").isLength({ min: 1 }).optional(),
    body("listedClothCount", "Invalid listedClothCount")
      .isLength({ min: 1 })
      .optional(),
    body("maxPrice", "Invalid maxPrice").isLength({ min: 1 }).optional(),
    body("minPrice", "Invalid minPrice").isLength({ min: 1 }).optional(),
    body("phoneNumber", "Invalid phoneNumber").isMobilePhone(),
    body("isSaleLive", "Invalid isSaleLive").isBoolean(),
    body("area", "Invalid area").isLength({ min: 1 }),
    body("address", "Invalid address").isLength({ min: 1 }),
    body("city", "Invalid city").isLength({ min: 1 }),
    body("state", "Invalid state").isLength({ min: 1 }),
    body("pincode", "Invalid pincode").isLength({ min: 1 }),
    body("social", "Invalid social").isObject().optional(),
    body("location", "Invalid location").isArray().optional(),
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
  "/shop/:id/earn",
  [param("id", "Invalid seller id").isMongoId(), requestValidator],
  authorizeRoles("admin", "seller"),
  controller.getShopEarnings
);

router.get("/shops", authorizeRoles("admin", "seller"), controller.getShopsOfSeller);

module.exports = router;
