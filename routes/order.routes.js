const express = require("express");
const router = new express.Router();
const controller = require("../controller/order.controller");

const { body, param } = require("express-validator");
const { authorizeRoles } = require("../util/middlewares/auth.js");

const {
  requestValidator,
} = require("../util/middlewares/express-validator.js");

router.get("/", async (req, res) => {
  res.send({
    message: "Order API",
    success: true,
  });
});

router.get(
  "/get-all-orders",
  authorizeRoles("admin"),
  controller.get_all_orders
);
router.get(
  "/order/:oid",
  [param("oid", "Invalid ProductID").isMongoId()],
  requestValidator,
  controller.get_single_order
);
router.get(
  "/get-all-paid-orders",
  authorizeRoles("admin"),
  controller.get_all_paid_orders
);
router.get(
  "/orders/user/:uid",
  [param("uid", "Invalid ProductID").isMongoId()],
  requestValidator,
  controller.get_orders_of_user
);
router.delete(
  "/delete-all-orders",
  authorizeRoles("admin"),
  controller.delete_all_orders
);

router.post(
  "/order",
  [body("products", "No Products were sent to be ordered").isArray({ min: 1 })],
  requestValidator,
  controller.create_order
);

router.post(
  "/verify-purchase",
  [
    body("orderId", "Invalid Order Id Sent").isLength({ min: 1 }),
    body("paymentId", "Invalid Payment Id Sent").isLength({ min: 10 }),
    body("signature", "No Verification data was sent.").isLength({ min: 50 }),
  ],
  requestValidator,
  controller.verify_purchase
);

module.exports = router;
