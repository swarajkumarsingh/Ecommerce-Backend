const model = require("../model/review.model.js");

module.exports.createReview = async (req, res) => {
  const review = await model.createReview(req.body);
  if (review && "id" in review) {
    return res.successResponse("Review created successfully", review);
  } else if (review && "already" in review) {
    return res.errorResponse(400, review.already);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.deleteReview = async (req, res) => {
  const rid = req.params.rid;
  const review = await model.deleteReview(rid);
  console.log(review);
  if (review && "id" in review) {
    return res.successResponse("Review created successfully", review);
  } else if (review && "notFound" in review) {
    return res.notFoundResponse(review.notFound);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getAllReviews = async (req, res) => {
  const { search } = req.body;
  const { page, limit } = req.query;
  const reviews = await model.getAllReviews(search, page, limit);
  if (reviews && Array.isArray(reviews)) {
    return res.successResponse("All Review Fetched successfully", reviews);
  }
  return res.internalErrorResponse("Something went wrong");
};
