const User = require("../db/model/User.js");
const mongoose = require("mongoose");

module.exports.createUser = async (body) => {
  return new Promise(async (resolve) => {
    try {
      const { name, email, password, phone } = body;

      const userExists = await this.findUserByEmail(email);
      if (userExists && "id" in userExists) {
        return resolve({ already: `User found with the id` });
      }

      const user = await new User({
        name,
        email,
        password,
        phone,
      }).save();

      resolve(user.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getUsers = async (search, page, limit) => {
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
      email: 1,
      avatar: 1,
      role: 1,
    };
    // Add Pagination
    query.push(
      { $sort: { _id: -1 } },
      { $skip: mongoSkip },
      { $limit: mongoLimit },
      { $project: projection }
    );
    return await User.aggregate(query);
  } catch (error) {
    return { error };
  }
};

module.exports.findUserByEmail = async (email, projection) => {
  return await User.findOne({ email }, projection || { __v: 0 });
};

module.exports.findUserRoleById = async (id) => {
  const user = await User.findOne({ _id: id }, { role: 1 });
  return user;
};

module.exports.updateUser = async (userId, body, projection) => {
  return new Promise(async (resolve) => {
    try {
      const updateExpression = {};
      // Validate the incoming data
      const fieldsToUpdate = [
        "name",
        "email",
        "avatar",
        "password",
        "addresses",
        "location",
        "fullAddress",
        "locationName",
        "otherLocationData",
      ];
      for (const field of fieldsToUpdate) {
        if (fieldsToUpdate.includes(field)) {
          updateExpression[field] = body[field];
        }
      }

      if ("email" in body) {
        // Verify Email
      }

      const updatedResult = await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(userId) },
        updateExpression,
        {
          new: true,
          projection: projection || {},
        }
      );
      if (updatedResult && "id" in updatedResult) {
        return resolve({ data: updatedResult.toObject() });
      }

      return resolve({ notFound: `No User found with the id` });
    } catch (err) {
      resolve({ error: err });
    }
  });
};

module.exports.updateUserByAdmin = async (userId, body, projection) => {
  return new Promise(async (resolve) => {
    try {
      const updateExpression = {};
      // Validate the incoming data
      const fieldsToUpdate = [
        "name",
        "email",
        "password",
        "email",
        "phone",
        "avatar",
        "role",
        "addresses",
        "locationName",
        "fullAddress",
        "otherLocationData",
        "location",
        "coins",
        "orders",
      ];

      for (const field of fieldsToUpdate) {
        if (fieldsToUpdate.includes(field)) {
          updateExpression[field] = body[field];
        }
      }

      if ("email" in body) {
        const userExits = this.userExistsWithEmail(body.email);

        if (userExits) {
          return { already: "User already exists, with this email." };
        }
      }

      const updatedResult = await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(userId) },
        updateExpression,
        {
          new: true,
          projection: projection || {},
        }
      );
      if (updatedResult && "id" in updatedResult) {
        return resolve({ data: updatedResult.toObject() });
      }

      return resolve({ notFound: `No User found with the id` });
    } catch (err) {
      resolve({ error: err });
    }
  });
};

module.exports.updateUserRole = async (userId, body, projection) => {
  return new Promise(async (resolve) => {
    try {
      const { role } = body;

      const updatedResult = await User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(userId) },
        { role },
        {
          new: true,
        }
      );

      if (updatedResult && "id" in updatedResult) {
        return resolve({ data: updatedResult.toObject() });
      }

      return resolve({ notFound: `No User found with the id` });
    } catch (err) {
      resolve({ error: err });
    }
  });
};

module.exports.findUserById = async (id, projection) => {
  const user = await User.findOne({ _id: id }, projection || {});

  return user.toObject();
};

module.exports.deleteUser = async (id, projection) => {
  return new Promise(async (resolve) => {
    try {
      // Remove User from User Model

      const deletedUser = await this.deleteUserById(id, projection);
      if (deletedUser && "id" in deletedUser) {
        return resolve({
          data: `User with Id ${id} deleted successfully`,
          user: deletedUser,
        });
      }

      return resolve({ notFound: `No User found with the id` });

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

module.exports.deleteUserById = async (id, projection) => {
  const user = await User.findByIdAndDelete(id, projection || {});
  return user;
};
