const express = require("express");
const { body, param } = require("express-validator");
const { authorizeRoles } = require("../util/middlewares/auth.js");

const controller = require("../controller/category.controller.js");
const {
  requestValidator,
} = require("../util/middlewares/express-validator.js");

const router = new express.Router();

// User Routes
router.post(
  "/category",
  [
    body("name", "Invalid Name").isLength({ min: 1 }),
    body("description", "Invalid description").isLength({ min: 5 }),
    body("image", "Invalid Image").isLength({ min: 1 }),
    body("gender", "Invalid gender").isLength({ min: 1, max: 10 }).optional(),
  ],
  requestValidator,
  authorizeRoles("admin"),
  controller.createCategory
);

// User Routes
router.patch(
  "/category/:id",
  [
    body("name", "Invalid Name").isLength({ min: 1 }),
    body("description", "Invalid description").isLength({ min: 5 }),
    body("image", "Invalid Image").isLength({ min: 1 }),
    body("gender", "Invalid gender").isLength({ min: 1, max: 10 }).optional(),
  ],
  requestValidator,
  authorizeRoles("admin"),
  controller.createCategory
);

// Admin Routes
router.get(
  "/category/:id",
  [param("id", "Invalid id").isMongoId(), requestValidator],
  authorizeRoles("admin"),
  controller.getCategory
);

router.get(
  "/category/:name",
  [param("name", "Invalid name").isLength({ min: 1 }), requestValidator],
  authorizeRoles("admin"),
  controller.getCategoryByName
);

router.get(
  "/products/category/:id",
  [param("id", "Invalid Category Id").isMongoId(), requestValidator],
  authorizeRoles("admin"),
  controller.getProductsByCategory
);

router.get(
  "/categories",
  authorizeRoles("admin"),
  controller.getCategories
);

router.delete(
  "/categories",
  authorizeRoles("admin"),
  controller.deleteCategories
);

router.delete(
  "/category/:id",
  [param("id", "Invalid Category Id").isMongoId(), requestValidator],
  authorizeRoles("admin"),
  controller.deleteCategory
);

module.exports = router;
