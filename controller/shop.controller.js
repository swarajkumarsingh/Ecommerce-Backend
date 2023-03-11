const model = require("../model/shop.model.js");

module.exports.createShop = async (req, res) => {
  const sellerId = req.userId;
  const response = await model.createShop(req.body, sellerId);
  if (response && "id" in response) {
    return res.successResponse("Shop successfully", response);
  } else if (response && "already" in response) {
    return res.alreadyExistsResponse(response.already);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getShop = async (req, res) => {
  const id = req.params.id;
  const response = await model.getShop(id);
  if (response && "id" in response) {
    return res.successResponse("Shop successfully", response);
  } else if (response && "notFound" in response) {
    return res.alreadyExistsResponse(response.notFound);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getShopsOfSeller = async (req, res) => {
  const { search } = req.body;
  const { page, limit } = req.query;
  const users = await model.getShops(search, page, limit);
  if (users && Array.isArray(users)) {
    return res.successResponse("All Shops fetched successfully.", users);
  }
  res.internalErrorResponse("Something went wrong");
};

module.exports.getShopEarnings = async (req, res) => {
  const sid = req.params.id;
  const shops = await model.getShopEarnings(sid);
  if (shops && Array.isArray(shops)) {
    return res.successResponse("All Shops fetched successfully.", shops);
  }
  res.internalErrorResponse("Something went wrong");
};
