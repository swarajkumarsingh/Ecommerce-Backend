const { default: mongoose } = require("mongoose");
const Seller = require("../db/model/Seller.js");
const Shop = require("../db/model/Shop.js");
const Product = require("../db/model/Product.js");

module.exports.createSeller = async (body) => {
  return new Promise(async (resolve) => {
    try {
      const {
        name,
        businessName,
        description,
        image,
        bannerImage,
        address,
        city,
        locationName,
        location,
      } = body;

      const sellerExistsWithBusinessName =
        await this.sellerExistsWithBusinessName(businessName);

      if (sellerExistsWithBusinessName) {
        return resolve({ already: "Business name already exists" });
      }

      const sellerExistsWithAddress = await this.sellerExistsWithAddress(
        address
      );

      if (sellerExistsWithAddress) {
        return resolve({ already: "Address already exists" });
      }

      const seller = await Seller.create({
        name,
        businessName,
        description,
        image,
        bannerImage,
        address,
        city,
        locationName,
        location,
      });

      if (!seller || seller.name === null || !seller.name) {
        return resolve({ error: "Error while creating Seller ID" });
      }

      return resolve(seller.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getSellerProfile = async (id) => {
  return new Promise(async (resolve) => {
    try {
      const seller = await Seller.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      if (!seller || !"name" in seller) {
        return resolve({ notFound: "Seller Account not found" });
      }

      return resolve(seller.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getSellerAccounts = async (limit, page) => {
  return new Promise(async (resolve) => {
    try {
      const mongoLimit = limit || 8;
      const mongoSkip = page ? (parseInt(page) - 1) * mongoLimit : 0;
      const query = [];
      // Add Pagination
      const projection = {
        name: 1,
        businessName: 1,
        image: 1,
        shops: 1,
      };
      query.push(
        { $sort: { _id: -1 } },
        { $skip: mongoSkip },
        { $limit: mongoLimit },
        { $project: projection }
      );
      return resolve(await Seller.aggregate(query));
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getSellerProfileByBusinessName = async (bName) => {
  return new Promise(async (resolve) => {
    try {
      const seller = await Seller.find({
        businessName: bName,
      });

      if (!seller || !"name" in seller) {
        return resolve({ notFound: "Seller Account not found" });
      }

      return resolve(seller.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.updateSeller = async (id, body) => {
  return new Promise(async (resolve) => {
    try {
      const updateExpression = {};
      // Validate the incoming data
      const fieldsToUpdate = [
        "name",
        "businessName",
        "description",
        "image",
        "bannerImage",
        "address",
        "city",
        "locationName",
        "location",
      ];

      for (const field of fieldsToUpdate) {
        if (fieldsToUpdate.includes(field)) {
          updateExpression[field] = body[field];
        }
      }

      const updatedResult = await Seller.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        updateExpression,
        {
          new: true,
          projection: projection || {},
        }
      );
      if (updatedResult && "name" in updatedResult) {
        return resolve(updatedResult.toObject());
      }

      return resolve({ notFound: `Seller Account not found` });
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.deleteSellerId = async (id) => {
  return new Promise(async (resolve) => {
    try {
      //   TODO: Test this API

      //   Deleting from Seller collection
      const seller = await Seller.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });
      if (!seller || !seller.acknowledged || seller.deletedCount === 0) {
        return resolve({
          error: "Seller Id not found / Error while deleting seller id",
        });
      }

      //   Get All Shop ID
      const shops = await Shop.find({
        sellerId: new mongoose.Types.ObjectId(id),
      });
      if (!shops || !shops.acknowledged || shops.deletedCount === 0) {
        return resolve({
          error: "Seller Id not found / Error while deleting seller id",
        });
      }

      //   Get All shopId and delete products from Product collection based on the shopID got above
      shops.map(async (shop) => {
        const product = await Product.deleteMany({
          shopId: new mongoose.Types.ObjectId(shop._id),
        });
        if (!product || !product.acknowledged || product.deletedCount === 0) {
          return resolve({
            error: "Seller Id not found / Error while deleting seller id",
          });
        }
      });

      // Deleting all shops from Shop Collection
      const shop = await Shop.deleteMany({
        sellerId: new mongoose.Types.ObjectId(id),
      });
      if (!shop || !shop.acknowledged || shop.deletedCount === 0) {
        return resolve({
          error: "Seller Id not found / Error while deleting seller id",
        });
      }

      //   return response
      return resolve({ data: "Seller Profile Deleted Successfully" });
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.sellerExistsWithBusinessName = async (bName) => {
  const seller = await Seller.findOne({ businessName: bName });
  return seller != null ? true : false;
};

module.exports.sellerExistsWithAddress = async (address) => {
  const seller = await Seller.findOne({ address });
  return seller != null ? true : false;
};
