const WishList = require("../db/model/WishList.js");

module.exports.createWishlist = async (body) => {
  return new Promise(async (resolve) => {
    try {
      const { userId, productId } = body;

      const wishlistExists = await this.findIfWishlistAlreadyExists(
        userId,
        productId
      );

      if (wishlistExists) {
        return resolve({ already: "Wishlist Already Exists" });
      }

      const wishlist = await WishList.create({
        userId,
        productId,
      });

      return resolve(wishlist.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.findIfWishlistAlreadyExists = async (userId, productId) => {
  const wishlist = await WishList.findOne({ userId, productId });

  return wishlist != null ? true : false;
};

module.exports.getAllWishlists = async (page, limit) => {
  try {
    // Add pagination
    // const wishlists = await WishList.find({}, { __v: 0 });

    const mongoLimit = limit || 10;
    const mongoSkip = page ? (parseInt(page) - 1) * mongoLimit : 0;
    const query = [];

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
    return await WishList.aggregate(query);
  } catch (error) {
    return { error };
  }
};

module.exports.getWishListOfProduct = async (productId) => {
  try {
    const wishlists = await WishList.find({ productId }, { __v: 0 });
    return wishlists;
  } catch (error) {
    return { error };
  }
};

module.exports.getWishListOfUser = async (userId) => {
  try {
    const wishlists = await WishList.find({ userId }, { __v: 0 });
    return wishlists;
  } catch (error) {
    return { error };
  }
};

module.exports.deleteSingleWishlist = async (body) => {
  const { userId, productId } = body;

  try {
    const wishlists = await WishList.findOneAndDelete(
      { userId, productId },
      { projection: { __v: 0 } }
    );

    if (wishlists && "id" in wishlists) {
      return wishlists;
    }

    return { notFound: "Invalid userId or productId" };
  } catch (error) {
    return { error };
  }
};
