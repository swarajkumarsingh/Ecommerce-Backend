const mongoose = require("mongoose");
const PromoBanner = require("../db/model/PromoBanner.js");

module.exports.createPromoBanner = async (body) => {
  return new Promise(async (resolve) => {
    try {
      const { key, name, description, banners } = body;

      const bannerExists = await this.checkIfPromoBannerExistsWIthKey(key);
      if (bannerExists) {
        return resolve({ already: "Banner Already exists with key" });
      }

      const banner = await PromoBanner.create({
        key,
        name,
        description,
        banners,
      });

      if (!banner || !"key" in banner) {
        return resolve({
          error: "error while creating banner",
        });
      }

      return resolve(banner.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getAllPromoBanners = async (search, page, limit) => {
  try {
    const searchQuery = search || "";
    const mongoLimit = limit || 8;
    const mongoSkip = page ? (parseInt(page) - 1) * mongoLimit : 0;
    const query = [];
    if (searchQuery.trim().length > 1) {
      query.push({ $match: { $text: { $search: searchQuery } } });
    }
    const projection = {
      createdOn: 0,
    };
    // Add Pagination
    query.push(
      { $sort: { _id: -1 } },
      { $skip: mongoSkip },
      { $limit: mongoLimit },
      { $project: projection }
    );
    return await PromoBanner.aggregate(query);
  } catch (error) {
    return { error };
  }
};

module.exports.getPromoBannerById = async (id) => {
  return new Promise(async (resolve) => {
    try {
      const banner = await PromoBanner.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      if (!banner || !"key" in banner) {
        return resolve({ notFound: `No Banner found` });
      }

      return resolve(banner.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getPromoBannerByKey = async (key) => {
  return new Promise(async (resolve) => {
    try {
      const banner = await PromoBanner.findOne({
        key,
      });

      if (!banner || !"key" in banner) {
        return resolve({ notFound: `No Banner found` });
      }

      return resolve(banner.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.deleteAllPromoBanners = async () => {
  return new Promise(async (resolve) => {
    try {
      const banner = await PromoBanner.deleteMany();
      if (!banner) {
        return resolve({ notFound: `No Banner found` });
      }

      return resolve({ data: "All PromoBanners deleted successfully" });
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.updatePromoBanner = async (id, body, projection) => {
  return new Promise(async (resolve) => {
    try {
      const updateExpression = {};

      // Validate the incoming data
      const fieldsToUpdate = ["key", "name", "description", "banners"];
      for (const field of fieldsToUpdate) {
        if (fieldsToUpdate.includes(field)) {
          updateExpression[field] = body[field];
        }
      }

      // Check is Banner already exists
      const bannerExists = await this.checkIfPromoBannerExistsWIthKey(body.key);
      if (bannerExists) {
        return resolve({ already: "Banner Already exists with key" });
      }

      // Update Document
      const updatedResult = await PromoBanner.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        updateExpression,
        {
          new: true,
          projection: projection || {},
        }
      );

      if (!updatedResult || !"name" in updatedResult) {
        return resolve({ notFound: `No Banner found` });
      }

      return resolve(updatedResult.toObject());
    } catch (error) {
      return resolve({ error });
    }
  });
};

module.exports.deletePromoBanner = async (id) => {
  return new Promise(async (resolve) => {
    try {
      const banner = await PromoBanner.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      if (!banner || !banner.acknowledged || banner.deletedCount === 0) {
        return resolve({
          notFound: `No Banner found`,
        });
      }

      return resolve({ data: "Banner Deleted successfully" });
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.checkIfPromoBannerExistsWIthKey = async (key) => {
  const banner = await PromoBanner.findOne({ key });
  return banner != null ? true : false;
};

module.exports.checkIfPromoBannerExistsById = async (id) => {
  const banner = await PromoBanner.findOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  return banner != null ? true : false;
};
