const express = require("express");
const { body, param } = require("express-validator");
const { authorizeRoles } = require("../util/middlewares/auth.js");

const {
  createWishlist,
  getAllWishlists,
  getWishListOfProduct,
  getWishListOfUser,
  deleteSingleWishlist
} = require("../controller/wishlist.controller..js");
const {
  requestValidator,
} = require("../util/middlewares/express-validator.js");

const router = new express.Router();

// User Routes
router.post(
  "/wishlist",
  [
    body("productId", "Invalid Product Id").isMongoId(),
    body("userId", "Invalid User Id").isMongoId(),
  ],
  requestValidator,
  createWishlist
);
router.delete(
  "/wishlist",
  [
    body("productId", "Invalid Product Id").isMongoId(),
    body("userId", "Invalid User Id").isMongoId(),
  ],
  requestValidator,
  deleteSingleWishlist
);
router.get("/wishlists/all", getAllWishlists);

// Admin Routes
router.get(
  "/wishlist/product/:pid",
  [param("pid", "Invalid userId").isMongoId(), requestValidator],
  authorizeRoles("admin"),
  getWishListOfProduct
);
router.get(
  "/wishlist/user/:uid",
  [param("uid", "Invalid userId").isMongoId(), requestValidator],
  authorizeRoles("admin"),
  getWishListOfUser
);

module.exports = router;
