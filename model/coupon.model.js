const mongoose = require("mongoose");
const Coupon = require("../db/model/Coupon.js");

module.exports.createCoupon = async (userId, body) => {
  return new Promise(async (resolve) => {
    try {
      const { code, discount } = body;

      const couponExists = await this.checkIfCouponExists(code);
      if (couponExists) {
        return resolve({ already: "Coupon Already Exists with the code" });
      }

      const coupon = await new Coupon({
        code,
        discount,
        createdBy: userId,
      }).save();

      return resolve(coupon.toObject());
    } catch (error) {
      return resolve({ error });
    }
  });
};

module.exports.getCouponById = async (id) => {
  return new Promise(async (resolve) => {
    try {
      const coupon = await this.findCouponById(id);
      console.log(id, coupon);

      if (coupon == null) {
        return { error: "Coupon not found" };
      }

      if (!coupon || "code" in coupon || coupon == null) {
        return { notFound: "Coupon not found" };
      }

      return resolve(coupon);
    } catch (error) {
      return resolve({ error });
    }
  });
};

module.exports.getCouponByCode = async (code) => {
  return new Promise(async (resolve) => {
    try {
      const coupon = await this.findCouponByCode(code);

      if (!coupon || "code" in coupon) {
        return { notFound: "Coupon not found" };
      }

      return resolve(coupon);
    } catch (error) {
      return resolve({ error });
    }
  });
};

module.exports.deleteCouponByCode = async (code) => {
  return new Promise(async (resolve) => {
    try {
      const coupon = await Coupon.deleteOne({ code });

      if (
        !coupon ||
        coupon == null ||
        coupon.acknowledged === false ||
        Number(coupon.deletedCount) === 0
      ) {
        return resolve({ error: "Coupon not found" });
      }

      return resolve({ data: "Coupon deleted successfully" });
    } catch (error) {
      return resolve({ error });
    }
  });
};

module.exports.updateCoupon = async (id, body) => {
  return new Promise(async (resolve) => {
    try {
      const updateExpression = {};
      // Validate the incoming data
      const fieldsToUpdate = ["discount", "maxUses"];
      for (const field of fieldsToUpdate) {
        if (fieldsToUpdate.includes(field)) {
          updateExpression[field] = body[field];
        }
      }

      const updatedResult = await Coupon.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        updateExpression,
        {
          new: true,
          projection: projection || {},
        }
      );

      if (
        !updatedResult ||
        !"id" in updatedResult ||
        "discount" in updatedResult
      ) {
        return resolve({ notFound: `No User found with the id` });
      }

      return resolve({ data: updatedResult.toObject() });
    } catch (error) {
      return resolve({ error });
    }
  });
};

module.exports.deleteCouponById = async (id) => {
  return new Promise(async (resolve) => {
    try {
      const coupon = await Coupon.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      if (
        !coupon ||
        coupon == null ||
        coupon.acknowledged === false ||
        Number(coupon.deletedCount) === 0
      ) {
        return resolve({ notFound: "Coupon not found" });
      }

      return resolve({ data: "Coupon deleted successfully" });
    } catch (error) {
      return resolve({ error });
    }
  });
};

module.exports.deleteAllCoupons = async () => {
  return new Promise(async (resolve) => {
    try {
      const coupon = await Coupon.deleteMany();

      if (!coupon || coupon == null || coupon.acknowledged === false) {
        return resolve({ notFound: "Error while deleting coupons" });
      }

      return resolve({ data: "Coupon deleted successfully" });
    } catch (error) {
      return resolve({ error });
    }
  });
};

module.exports.getAllCoupons = async (search, page, limit) => {
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
    return await Coupon.aggregate(query);
  } catch (error) {
    return { error };
  }
};

module.exports.checkIfCouponExists = async (code) => {
  const coupon = await Coupon.findOne({ code });
  return coupon != null ? true : false;
};

module.exports.findCouponByCode = async (code, projection) => {
  const coupon = await Coupon.findOne({ code }, projection || {});
  return coupon;
};

module.exports.findCouponById = async (id, projection) => {
  const coupon = await Coupon.findById(id, projection || {});
  console.log(coupon);
  return coupon;
};
