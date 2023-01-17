const express = require("express");
const router = new express.Router();
const controller = require("../controller/cart.controller");

const { body } = require("express-validator");
const { authorizeRoles } = require("../util/middlewares/auth.js");

const {
  requestValidator,
} = require("../util/middlewares/express-validator.js");

router.get("/", async (req, res) => {
  res.send({
    message: "Review API",
    success: true,
  });
});

router.get("/my-cart", controller.getMyCart);
router.post(
  "/cart/add",
  [
    body("productId", "Invalid Product Id Sent").isMongoId(),
    body("size", "Invalid Size Sent").isLength({ min: 1 }),
    body("qty", "Invalid Quantity Sent").isInt({ min: 1, max: 10 }),
  ],
  requestValidator,
  controller.addCart
);
router.patch(
  "/cart/update",
  [
    body("productId", "Invalid Product Id Sent").isMongoId(),
    body("size", "Invalid Size Sent").isLength({ min: 1 }),
    body("qty", "Invalid Quantity Sent").isInt({ min: 1, max: 10 }),
  ],
  requestValidator,
  controller.updateCart
);
router.delete(
  "/cart/remove",
  [body("productId", "Invalid Product Id Sent").isMongoId()],
  requestValidator,
  controller.removeItem
);
router.delete(
  "/cart/remove/all",
  authorizeRoles("admin"),
  controller.removeAllItem
);

module.exports = router;
