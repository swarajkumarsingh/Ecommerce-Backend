const model = require("../model/seller.model.js");

module.exports.createSellerAccount = async (req, res) => {
  const response = await model.createSeller(req.body);
  console.log(response);
  if (response && "id" in response) {
    return res.successResponse("Seller Account successfully", response);
  } else if (response && "already" in response) {
    return res.alreadyExistsResponse(response.already);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getSellerProfile = async (req, res) => {
  const id = req.userId;
  const response = await model.getSellerProfile(id);
  if (response && "id" in response) {
    return res.successResponse("Seller Account fetched successfully", response);
  } else if (response && "notfound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getSellerAccount = async (req, res) => {
  const id = req.params.id;
  const response = await model.getSellerProfile(id);
  if (response && "id" in response) {
    return res.successResponse("Seller Account fetched successfully", response);
  } else if (response && "notfound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getSellerAccounts = async (req, res) => {
  const { page, limit } = req.query;
  const response = await model.getSellerAccounts(limit, page);
  if (response && Array.isArray(response)) {
    return res.successResponse(
      "Fetched All Seller Account successfully",
      response
    );
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getSellerProfileByBusinessName = async (req, res) => {
  const bName = req.params.bName;
  const response = await model.getSellerProfile(bName);
  if (response && "id" in response) {
    return res.successResponse("Seller Account fetched successfully", response);
  } else if (response && "notfound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.updateSellerAccount = async (req, res) => {
  const userId = req.params.id;
  const response = await model.updateSeller(userId, req.body);
  if (response && "data" in response) {
    return res.successResponse("Account Updated", response.data);
  } else if (response && "already" in response) {
    return res.alreadyExistsResponse(response.already);
  } else if (response && "notFound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  res.internalErrorResponse("Something went wrong");
};

module.exports.updateSellerProfile = async (req, res) => {
  const userId = req.id;
  const response = await model.updateSeller(userId, req.body);
  if (response && "data" in response) {
    return res.successResponse("Account Updated", response.data);
  } else if (response && "notFound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  res.internalErrorResponse("Something went wrong");
};

module.exports.deleteSellerAccount = async (req, res) => {
  const id = req.params.id;
  const response = await model.deleteSellerId(id);
  if (response && "data" in response) {
    return res.successResponse("Account Updated", response.data);
  } else if (response && "notFound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  res.internalErrorResponse("Something went wrong");
};

module.exports.deleteSellerProfile = async (req, res) => {
  const id = req.userId;
  const response = await model.deleteSellerId(id);
  if (response && "data" in response) {
    return res.successResponse("Account Updated", response.data);
  } else if (response && "notFound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  res.internalErrorResponse("Something went wrong");
};
