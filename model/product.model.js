const Product = require("../db/model/Product.js");
const mongoose = require("mongoose");

module.exports.createProduct = async (req) => {
  return new Promise(async (resolve) => {
    try {
      const {
        name,
        description,
        gender,
        primaryColor,
        price,
        mrp,
        category,
        stock,
        isWearAndReturnEnabled,
        brandInfo,
      } = req.body;

      const product = await Product.create({
        name,
        description,
        gender,
        primaryColor,
        mrp,
        price,
        category,
        stock,
        createdBy: req.userId,
        isWearAndReturnEnabled,
        brandInfo,
      });

      return resolve(product.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getProductById = async (uid, id, projection) => {
  return new Promise(async (resolve) => {
    try {
      const findProduct = await Product.findOne({ _id: id });

      // check product exists
      if (!findProduct && !"id" in findProduct) {
        return resolve({ notFound: `Product not found` });
      }

      // Avoid to insert id again in productViewers
      if (
        findProduct.productViewers.user &&
        findProduct.productViewers.user.toString().includes(uid)
      ) {
        return resolve(findProduct.toObject());
      }

      // Push and insert ID
      const product = await Product.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        {
          $push: {
            productViewers: {
              user: uid,
            },
          },
        },
        { new: true, projection: projection || {} }
      );
      return resolve(product.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getProductViews = async (id) => {
  return new Promise(async (resolve) => {
    try {
      const product = await Product.findOne(
        { _id: id },
        { projection: { productViewers: 1 } }
      ).populate("productViewers.user", "name email phone");

      if ("_id" in product || "id" in product) {
        return resolve(product.toObject());
      }

      return resolve({ notFound: "Product not found" });
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getAllProduct = async (search, page, limit) => {
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
        productViewers: 0,
        createdBy: 0,
        stock: 0,
      };
      // Add Pagination
      query.push(
        { $sort: { _id: -1 } },
        { $skip: mongoSkip },
        { $limit: mongoLimit },
        { $project: projection }
      );
      const product = await Product.aggregate(query);
      return resolve(product);
    } catch (error) {
      resolve({ error });
    }
  });
};
module.exports.updateProduct = async (id, body, projection) => {
  return new Promise(async (resolve) => {
    try {
      const updateExpression = {};
      // Validate the incoming data
      const fieldsToUpdate = [
        "name",
        "description",
        "primaryImage",
        "otherImages",
        "gender",
        "primaryColor",
        "mrp",
        "price",
        "rating",
        "category",
        "stock",
        "numOfReviews",
        "isWearAndReturnEnabled",
        "productViewers",
        "brandInfo",
        "locationName",
        "location",
        "location",
        "createdBy",
        "createdAt",
      ];

      for (const field of fieldsToUpdate) {
        if (fieldsToUpdate.includes(field)) {
          updateExpression[field] = body[field];
        }
      }

      const updatedResult = await Product.findOneAndUpdate(
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

      return resolve({ notFound: `User not found with id ${id}` });
    } catch (err) {
      resolve({ error: err });
    }
  });
};

module.exports.deleteProduct = async (id, projection) => {
  return new Promise(async (resolve) => {
    try {
      // Remove Product from Product Model

      const deletedUser = await Product.deleteOne({
        _id: id,
        projection: projection || {},
      });

      if (deletedUser && deletedUser != null) {
        return resolve(deletedUser);
      }
      return resolve({ notFound: "Product not found" });

      // Delete User from Review
      // await this.deleteReviewByUser(id);

      // Delete User Address
      // await this.deleteAddressByUser(id);

      // Delete User wishlist
      // await this.deleteWishListByUser(id);
    } catch (error) {
      resolve({ error });
    }
  });
};
