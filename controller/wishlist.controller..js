const model = require("../model/wishlist.model.js");

module.exports.createWishlist = async (req, res) => {
  const response = await model.createWishlist(req.body);
  if (response && "id" in response) {
    return res.successResponse("Wishlist created successfully", response);
  } else if (response && "already" in response) {
    return res.status(202).json({ data: "Wishlist Already Added." });
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getAllWishlists = async (req, res) => {
  const { page, limit } = req.query;
  const wishlist = await model.getAllWishlists(page, limit);
  if (wishlist && Array.isArray(wishlist)) {
    return res.successResponse("All Wishlist fetched successfully", wishlist);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getWishListOfProduct = async (req, res) => {
  const pid = req.params.pid;
  const wishlist = await model.getWishListOfProduct(pid);
  if (wishlist && Array.isArray(wishlist)) {
    return res.successResponse(
      "All Wishlists from product fetched successfully",
      wishlist
    );
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getWishListOfUser = async (req, res) => {
  const uid = req.params.uid;
  const wishlist = await model.getWishListOfUser(uid);
  if (wishlist && Array.isArray(wishlist)) {
    return res.successResponse(
      "All Wishlists from product fetched successfully",
      wishlist
    );
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.deleteSingleWishlist = async (req, res) => {
  const response = await model.deleteSingleWishlist(req.body);
  if (response && "id" in response) {
    return res.successResponse("Item Delete Successfully", response);
  } else if (response && "notFound" in response) {
    return res.status(400).json({ error: false, data: response.notFound });
  }
  return res.internalErrorResponse("Something went wrong");
};
