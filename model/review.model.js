const Review = require("../db/model/Review.js");
const Product = require("../db/model/Product.js");
const productModel = require("../model/product.model.js");
const mongoose = require("mongoose");

module.exports.createReview = async (body) => {
  return new Promise(async (resolve) => {
    try {
      const { userId, productId, rating, comment } = body;

      const reviewExists = await this.findIfReviewAlreadyExists(
        userId,
        productId
      );

      const productExists = await productModel.checkIfProductExists(productId);

      if (reviewExists) return resolve({ already: "Review Already Exists" });

      if (productExists == false)
        return resolve({ notFound: "Product Not found" });

      const user = await Review.create({
        userId,
        productId,
        rating,
        comment,
      });

      // Calculate Average Rating
      let avgRating = await Review.aggregate([
        {
          $match: {
            productId: new mongoose.Types.ObjectId(productId),
          },
        },
        { $group: { _id: "$productId", avgRating: { $avg: "$rating" } } },
      ]);
      avgRating = avgRating[0].avgRating;

      // Update AvgRating in Product
      await Product.updateOne(
        { _id: new mongoose.Types.ObjectId(productId) },
        {
          $set: {
            avgRating,
          },
          $inc: { numberOfReviews: 1 },
        }
      );

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

module.exports.getReview = async (rid) => {
  try {
    const review = await Review.findOne(
      { _id: rid },
      { projection: { __v: 0 } }
    );
    if (review && "id" in review) {
      return review.toObject();
    }
    return { notFound: "Review not found" };
  } catch (error) {
    return { error };
  }
};

module.exports.deleteAllReviews = async () => {
  try {
    const review = await Review.deleteMany();
    if (review == null) return { error: "Error while deleting all reviews" };
    return review;
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

module.exports.updateReview = async (id, body, projection) => {
  return new Promise(async (resolve) => {
    try {
      const updateExpression = {};
      // Validate the incoming data
      const fieldsToUpdate = ["rating", "comment"];

      for (const field of fieldsToUpdate) {
        if (fieldsToUpdate.includes(field)) {
          updateExpression[field] = body[field];
        }
      }

      const updatedResult = await Review.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        updateExpression,
        {
          new: true,
          projection: projection || {},
        }
      );
      if (updatedResult && "id" in updatedResult) {
        return resolve(updatedResult.toObject());
      }

      return resolve({ notFound: `Review not found` });
    } catch (error) {
      resolve({ error });
    }
  });
};
