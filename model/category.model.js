/* eslint-disable new-cap */
const mongoose = require("mongoose");
const Category = require("../db/model/Category.js");
const Product = require("../db/model/Product.js");

module.exports.createCategory = async (userId, body) => {
  return new Promise(async (resolve) => {
    try {
      const { name, description, image, gender } = body;

      // Check is category already exists
      const categoryExists = await this.findIfCategoryAlreadyExists(name);

      if (categoryExists)
        return resolve({ already: "Category Already Exists" });

      const category = await Category.create({
        name,
        description,
        image,
        gender,
        createdBy: userId,
      });

      if (!category || !"id" in category) {
        return resolve({ error: "Error while creating Category" });
      }

      return resolve(category.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getCategory = async (id) => {
  return new Promise(async (resolve) => {
    try {
      const category = await Category.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      if (!category || !"name" in category) {
        return resolve({ notFound: "Category not found" });
      }

      return resolve(category.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getCategoryByName = async (name) => {
  return new Promise(async (resolve) => {
    try {
      const category = await Category.findOne({
        name,
      });

      if (!category || "name" in category) {
        return resolve({ notFound: "Category not found" });
      }

      return resolve(category.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getProductsByCategory = async (id, page, limit) => {
  try {
    console.log(id);
    const mongoLimit = limit || 8;
    const mongoSkip = page ? (parseInt(page) - 1) * mongoLimit : 0;
    const query = [];
    const projection = {
      name: 1,
      description: 1,
      image: 1,
    };
    // Add Pagination
    query.push(
      { $match: { categoryId: new mongoose.Types.ObjectId(id) } },
      { $skip: mongoSkip },
      { $limit: mongoLimit },
      { $project: projection }
    );
    const products = await Product.aggregate(query);

    return products;
  } catch (error) {
    return { error };
  }
};

module.exports.deleteCategories = async () => {
  return new Promise(async (resolve) => {
    try {
      const category = await Category.deleteMany();

      if (category.acknowledged === false) {
        return resolve({ error: "Error while deleting categories" });
      }

      return resolve({ data: "All Categories deleted successfully" });
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.deleteCategory = async (id) => {
  return new Promise(async (resolve) => {
    try {
      const category = await Category.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      if (category.acknowledged === false) {
        return resolve({ error: "Error while deleting Category" });
      }

      if (category.deletedCount === 0) {
        return resolve({ notFound: "No Category found" });
      }

      return resolve({ data: "Category deleted successfully" });
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getCategories = async (search, page, limit) => {
  try {
    const searchQuery = search || "";
    const mongoLimit = limit || 8;
    const mongoSkip = page ? (parseInt(page) - 1) * mongoLimit : 0;
    const query = [];
    if (searchQuery.trim().length > 1) {
      query.push({ $match: { $text: { $search: searchQuery } } });
    }
    const projection = {
      name: 1,
      description: 1,
      image: 1,
    };
    // Add Pagination
    query.push(
      { $sort: { _id: -1 } },
      { $skip: mongoSkip },
      { $limit: mongoLimit },
      { $project: projection }
    );
    return await Category.aggregate(query);
  } catch (error) {
    return { error };
  }
};

module.exports.updateCategory = async (id, body) => {
  return new Promise(async (resolve) => {
    try {
      const updateExpression = {};

      // Validate the incoming data
      const fieldsToUpdate = ["name", "description", "image", "gender"];
      for (const field of fieldsToUpdate) {
        if (fieldsToUpdate.includes(field)) {
          updateExpression[field] = body[field];
        }
      }

      // Check is category already exists
      const categoryExists = await this.findIfCategoryAlreadyExists(body.name);
      if (categoryExists)
        return resolve({ already: "Category Already Exists" });

      // Update Document
      const updatedResult = await Category.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        updateExpression,
        {
          new: true,
          projection: projection || {},
        }
      );

      if (!updatedResult || !"name" in updatedResult) {
        return resolve({ notFound: `No Category found with the id` });
      }

      return resolve(updatedResult.toObject());
    } catch (error) {
      return resolve({ error });
    }
  });
};

module.exports.findIfCategoryAlreadyExists = async (name) => {
  const category = await Category.findOne({ name });
  console.log("a", category);
  return category != null ? true : false;
};
