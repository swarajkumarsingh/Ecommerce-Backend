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
    message: "Review API",
    success: true,
  });
});

router.post(
  "/seller",
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
  controller.createSellerAccount
);

router.get("/sellers", authorizeRoles("admin"), controller.getSellerAccounts);
router.get(
  "/seller/profile",
  authorizeRoles("admin", "seller"),
  controller.getSellerProfile
);
router.get(
  "/seller/:id",
  [param("id", "Invalid seller id").isMongoId(), requestValidator],
  authorizeRoles("admin"),
  controller.getSellerAccount
);
router.patch(
  "/seller/:id",
  [param("id", "Invalid seller id").isMongoId(), requestValidator],
  authorizeRoles("admin"),
  controller.updateSellerAccount
);
router.patch(
  "/seller",
  authorizeRoles("admin"),
  controller.updateSellerProfile
);
router.delete(
  "/seller",
  authorizeRoles("admin"),
  controller.deleteSellerAccount
);
router.delete(
  "/seller/:id",
  [param("id", "Invalid seller id").isMongoId(), requestValidator],
  authorizeRoles("admin"),
  controller.deleteSellerProfile
);

module.exports = router;
