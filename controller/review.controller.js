const model = require("../model/review.model.js");

module.exports.createReview = async (req, res) => {
  const review = await model.createReview(req.body);
  if (review && "id" in review) {
    return res.successResponse("Review created successfully", review);
  } else if (review && "already" in review) {
    return res.errorResponse(review.already, 400);
  } else if (review && "notFound" in review) {
    return res.errorResponse(review.notFound, 404);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.deleteReview = async (req, res) => {
  const rid = req.params.rid;
  const review = await model.deleteReview(rid);
  if (review && "id" in review) {
    return res.successResponse("Review deleted successfully", review);
  } else if (review && "notFound" in review) {
    return res.notFoundResponse(review.notFound);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getReview = async (req, res) => {
  const rid = req.params.rid;
  const review = await model.getReview(rid);
  if (review && "id" in review) {
    return res.successResponse("Review deleted successfully", review);
  } else if (review && "notFound" in review) {
    return res.notFoundResponse(review.notFound);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.updateReview = async (req, res) => {
  const rid = req.params.rid;
  const response = await model.updateReview(rid, req.body);
  console.log(response);
  if (response && "id" in response) {
    return res.successResponse("Review updated successfully", response);
  } else if (response && "notFound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.deleteAllReviews = async (req, res) => {
  const reviews = await model.deleteAllReviews();
  if (reviews && "deletedCount" in reviews) {
    return res.successResponse("All Reviews deleted successfully");
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
