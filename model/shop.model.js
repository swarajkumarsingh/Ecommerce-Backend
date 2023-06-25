const mongoose = require("mongoose");

const Shop = require("../db/model/Shop.js");
const Seller = require("../db/model/Seller.js");
const Product = require("../db/model/Product.js");

module.exports.createShop = async (body, sellerId) => {
  return new Promise(async (resolve) => {
    try {
      const {
        name,
        description,
        profilePhoto,
        media,
        clothCount,
        listedClothCount,
        maxPrice,
        minPrice,
        rating,
        reviewCount,
        phoneNumber,
        isSaleLive,
        area,
        address,
        city,
        state,
        pincode,
        location,
        social,
      } = body;

      const shopExistsWithName = await this.shopExistsWithName(name);

      if (shopExistsWithName) {
        return resolve({ already: "Shop name already exists" });
      }

      const shop = await Shop.create({
        name,
        description,
        profilePhoto,
        media,
        clothCount,
        listedClothCount,
        minPrice,
        maxPrice,
        rating,
        reviewCount,
        sellerId,
        phoneNumber,
        isSaleLive,
        area,
        address,
        city,
        state,
        pincode,
        location,
        social,
      });

      //   Add Shop in Seller's ID
      if (!shop || shop.name === null || !shop.name) {
        return resolve({ error: "Error while creating Seller ID" });
      }

      await Seller.updateOne(
        { _id: new mongoose.Types.ObjectId(sellerId) },
        {
          $push: {
            shops: shop.id,
          },
        }
      );

      return resolve(shop.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getShop = (id) => {
  return new Promise(async (resolve) => {
    const shop = await Shop.findOne({ _id: new mongoose.Types.ObjectId(id) });
    const products = await Product.find({
      shopId: new mongoose.Types.ObjectId(id),
    });

    if (!shop || !"name" in shop) {
      return resolve({ notFound: "Shop not found" });
    }

    const data = {
      shop: shop.toObject(),
      products,
    };

    return data;
  });
};

module.exports.getShops = async (search, page, limit) => {
  try {
    let query = [];
    const searchQuery = search || "";
    const mongoLimit = limit || 8;
    const mongoSkip = page ? (parseInt(page) - 1) * mongoLimit : 0;
    if (searchQuery.trim().length > 1) {
      query.push({ $match: { $text: { $search: searchQuery } } });
    }
    const projection = {
      name: 1,
      profilePhoto: 1,
      media: 1,
      rating: 1,
      reviewCount: 1,
      city: 1,
    };
    // Add Pagination
    query.push(
      { $sort: { _id: -1 } },
      { $skip: mongoSkip },
      { $limit: mongoLimit },
      { $project: projection }
    );
    return await Shop.aggregate(query);
  } catch (error) {
    return { error };
  }
};

module.exports.updateShop = async (id, body) => {
  return new Promise(async (resolve) => {
    try {
      const updateExpression = {};
      // Validate the incoming data
      const fieldsToUpdate = [
        "name",
        "profilePhoto",
        "media",
        "phoneNumber",
        "isSaleLive",
        "area",
        "address",
        "city",
        "state",
        "pincode",
        "location",
        "social",
      ];

      for (const field of fieldsToUpdate) {
        if (fieldsToUpdate.includes(field)) {
          updateExpression[field] = body[field];
        }
      }

      const shopExistsWithName = await this.shopExistsWithName(body.name);
      if (shopExistsWithName) {
        return resolve({ already: "Shop name already exists" });
      }

      const updatedResult = await Seller.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        updateExpression,
        {
          new: true,
          projection: projection || {},
        }
      );

      if (!updatedResult || !"name" in updatedResult) {
        return resolve({ notFound: `Shop Account not found` });
      }

      return resolve(updatedResult.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

// Get Shops total earnings
module.exports.getShopEarnings = async (sid) => {
  return new Promise(async (resolve) => {
    try {
      const totalEarnings = Shop.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(sid) } },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$productsSold.$productAmount",
            },
          },
        },
      ]);

      const data = {
        shopId: sid,
        totalEarnings,
      };

      // Return response
      return resolve({ data });
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.deleteShop = async (id) => {
  return new Promise(async (resolve) => {
    try {
      // Delete All Products
      const products = await Product.deleteMany({
        shopId: new mongoose.Types.ObjectId(id),
      });

      // Delete the Shop
      const shop = await Shop.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      // Return response
      return resolve({ data: "Shop Deleted Successfully" });
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.shopExistsWithName = async (name) => {
  const seller = await Shop.findOne({ name });
  return seller != null ? true : false;
};
