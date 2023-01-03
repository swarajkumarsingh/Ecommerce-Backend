const express = require("express");
const {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  getProductViews,
  deleteProduct,
} = require("../controller/product.controller");
const { body, param } = require("express-validator");
const { authorizeRoles } = require("../util/middlewares/auth.js");

const {
  requestValidator,
} = require("../util/middlewares/express-validator.js");
const router = new express.Router();

router.get("/", async (req, res) => {
  res.send({
    message: "Product API",
    success: true,
  });
});

router.post(
  "/product/new",
  [
    body("name", "Invalid Name").isLength({ min: 3, max: 100 }),
    body("description", "Invalid description").isLength({ min: 5 }),
    body("gender", "Invalid gender").isLength({ min: 4 }),
    body("price", "Invalid price").isLength({ min: 1, max: 5 }),
    body("mrp", "Invalid mrp").isLength({ min: 1, max: 5 }),
    body("category", "Invalid category").isLength({ min: 3 }),
    body("stock", "Invalid stock").isLength({ min: 1 }),
    body("brandInfo", "Invalid brandInfo").isLength({ min: 1 }),
    body("isWearAndReturnEnabled")
      .isBoolean()
      .withMessage("Invalid isWearAndReturnEnabled"),
  ],
  requestValidator,
  authorizeRoles("admin"),
  createProduct
);

router.get("/product/:pid", [
  [param("pid", "Invalid userId").isMongoId(), requestValidator],
  getProduct,
]);

router.get("/product-viewers-list/:pid", [
  param("pid", "Invalid ProductId").isMongoId(),
  requestValidator,
  authorizeRoles("admin"),
  getProductViews,
]);

router.patch("/product/:pid", [
  param("pid", "Invalid ProductId").isMongoId(),
  requestValidator,
  updateProduct,
]);

router.delete("/product/:pid", [
  param("pid", "Invalid ProductId").isMongoId(),
  requestValidator,
  deleteProduct,
]);

router.get("/products", getAllProduct);

module.exports = router;