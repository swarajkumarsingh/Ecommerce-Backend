/* eslint-disable no-unused-vars */
const Product = require("../db/model/Product.js");
const User = require("../db/model/User.js");
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

      return resolve(product);
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getProductById = async (uid, id, projection) => {
  return new Promise(async (resolve) => {
    try {
      const product = await Product.findOne({ _id: id });

      if (product && "id" in product) {
        await Product.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(id) },
          {
            productViews: [
              {
                user: uid,
              },
            ],
          },
          { new: true, projection: projection || {} }
        );

        return resolve(product);
      }
      return resolve({ error: "404 No product found with the given ID" });
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getAllProduct = async () => {
  return new Promise(async (resolve) => {
    try {
      const products = await Product.find();

      if (products && Array.isArray(products)) {
        resolve(products);
      }
      resolve({ error: "Error while fetching products list" });
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
        return resolve(updatedResult);
      }

      return resolve({ error: `User not found with id ${id}` });
    } catch (err) {
      resolve({ error: err });
    }
  });
};
