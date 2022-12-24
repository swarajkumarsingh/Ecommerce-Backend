const Review = require("../db/model/Review.js");
const Product = require("../db/model/Product.js");

module.exports.createReview = async (body) => {
  return new Promise(async (resolve) => {
    try {
      const { userId, productId, rating, comment } = body;

      const reviewExists = await this.findIfReviewAlreadyExists(
        userId,
        productId
      );

      if (reviewExists) {
        return resolve({ already: "Review Already Exists" });
      }

      // TODO: update average rating in product schema
      const productReviewCount = await Product.updateOne(
        { _id: productId },
        { $inc: { numberOfReviews: 1 } },
        { new: true }
      );

      if (productReviewCount == null) {
        return resolve({ error: "Error updating product review count" });
      }

      const user = await Review.create({
        userId,
        productId,
        rating,
        comment,
      });

      return resolve(user.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.deleteReview = async (rid) => {
  try {
    const review = await Review.findOneAndDelete(
      { _id: rid },
      { projection: { __v: 0 } }
    );
    if (review && "id" in review) {
      return review;
    }
    return { notFound: "Review not found" };
  } catch (error) {
    return { error };
  }
};

module.exports.findIfReviewAlreadyExists = async (userId, productId) => {
  const wishlist = await Review.findOne({ userId, productId });
  return wishlist != null ? true : false;
};

module.exports.getAllReviews = async (search, page, limit) => {
  return new Promise(async (resolve) => {
    try {
      const searchQuery = search || "";
      const mongoLimit = limit || 8;
      const mongoSkip = page ? (parseInt(page) - 1) * mongoLimit : 0;
      const query = [];
      if (searchQuery.trim().length > 1) {
        query.push({ $match: { $text: { $search: searchQuery } } });
      }
      const projection = {
        __v: 0,
      };
      // Add Pagination
      query.push(
        { $sort: { _id: -1 } },
        { $skip: mongoSkip },
        { $limit: mongoLimit },
        { $project: projection }
      );
      const review = await Review.aggregate(query);
      return resolve(review);
    } catch (error) {
      resolve({ error });
    }
  });
};
