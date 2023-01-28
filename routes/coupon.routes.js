const express = require("express");
const { body, param } = require("express-validator");
const { authorizeRoles } = require("../util/middlewares/auth.js");

const controller = require("../controller/coupon.controller.js");
const {
  requestValidator,
} = require("../util/middlewares/express-validator.js");

const router = new express.Router();

// User Routes
router.post(
  "/coupon",
  [
    body("code", "Invalid Coupon Code").isLength({ min: 4 }),
    body("discount", "Invalid Discount").isLength({ min: 1, max: 9 }),
  ],
  requestValidator,
  authorizeRoles("admin"),
  controller.createCoupon
);

// Admin Routes
router.get("/coupons", authorizeRoles("admin"), controller.getAllCoupons);

router.get(
  "/coupon/id/:id",
  [param("id", "Invalid Coupon Id").isMongoId(), requestValidator],
  authorizeRoles("admin"),
  controller.getCouponById
);

router.get(
  "/coupon/code/:code",
  [param("code", "Invalid code").isLength({ min: 4 }), requestValidator],
  authorizeRoles("admin"),
  controller.getCouponByCode
);

router.delete(
  "/coupon/:code",
  [param("code", "Invalid code").isLength({ min: 4 }), requestValidator],
  authorizeRoles("admin"),
  controller.deleteCouponByCode
);

router.patch(
  "/coupon/:id",
  [
    param("code", "Invalid code").isLength({ min: 4 }),
    body("maxUses", "Invalid maxUsers").isLength({ min: 1, max: 10 }),
    body("discount", "Invalid Discount").isLength({ min: 1, max: 10 }),
  ],
  requestValidator,
  authorizeRoles("admin"),
  controller.updateCoupon
);

router.delete(
  "/coupon/:id",
  [param("id", "Invalid coupon id").isMongoId(), requestValidator],
  authorizeRoles("admin"),
  controller.deleteCouponById
);

router.delete("/coupons", authorizeRoles("admin"), controller.deleteAllCoupons);

module.exports = router;
