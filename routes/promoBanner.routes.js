const express = require("express");
const { body, param, check } = require("express-validator");
const controller = require("../controller/promoBanner.controller.js");
const { authorizeRoles } = require("../util/middlewares/auth.js");

const router = new express.Router();
// const { authorizeRoles } = require("../util/middlewares/auth.js");
const {
  requestValidator,
} = require("../util/middlewares/express-validator.js");

router.get("/", async (_, res) => {
  res.send({
    message: "Review API",
    success: true,
  });
});

router.post(
  "/banner",
  [
    check("key")
      .custom((value) => !/\s/.test(value))
      .isLength({ min: 1 })
      .withMessage("No spaces are allowed in the Banner Key"),
    body("name", "Invalid name").isLength({ min: 1 }),
    body("description", "Invalid description").isLength({ min: 5 }),
    body("banners", "Invalid Banners").isArray({ min: 1 }),
  ],
  requestValidator,
  controller.createPromoBanner
);

router.get(
  "/banner/:id",
  [param("id", "Invalid Banner Id").isMongoId(), requestValidator],
  authorizeRoles("admin"),
  controller.getPromoBannerById
);

router.get(
  "/banner/key/:key",
  [
    check("key")
      .custom((value) => !/\s/.test(value))
      .isLength({ min: 1 })
      .withMessage("No spaces are allowed in the Banner Key"),
    requestValidator,
  ],
  authorizeRoles("admin"),
  controller.getPromoBannerByKey
);

router.get("/banners", authorizeRoles("admin"), controller.getPromoBanners);

router.patch(
  "/banner/:id",
  [param("id", "Invalid Banner Id").isMongoId(), requestValidator],
  controller.updatePromoBanner
);

router.delete(
  "/banner/:id",
  [param("id", "Invalid Banner Id").isMongoId(), requestValidator],
  controller.deletePromoBanner
);

router.delete("/banners", controller.deleteAllPromoBanners);

module.exports = router;
