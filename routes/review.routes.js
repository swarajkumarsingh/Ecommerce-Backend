const express = require("express");
const { body, param } = require("express-validator");
const {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  deleteAllReviews,
  updateReview,
} = require("../controller/review.controller.js");
const { authorizeRoles } = require("../util/middlewares/auth.js");

const router = new express.Router();
// const { authorizeRoles } = require("../util/middlewares/auth.js");
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
  "/review/new",
  [
    body("userId", "Invalid Name").isMongoId(),
    body("productId", "Invalid email").isMongoId(),
    body("rating", "Invalid rating")
      .isLength({ max: 1 })
      .isIn(["1", "2", "3", "4", "5"]),
    body("comment", "Invalid comment").isLength({ min: 5, max: 1000 }),
  ],
  requestValidator,
  createReview
);

router.get("/reviews", authorizeRoles("admin"), getAllReviews);
router.get(
  "/review/:rid",
  [param("rid", "Invalid reviewId").isMongoId(), requestValidator],
  getReview
);

router.patch(
  "/review/:rid",
  [param("rid", "Invalid reviewId").isMongoId(), requestValidator],
  updateReview
);

router.delete(
  "/review/:rid",
  [param("rid", "Invalid reviewId").isMongoId(), requestValidator],
  deleteReview
);

router.delete("/reviews", deleteAllReviews);

module.exports = router;
