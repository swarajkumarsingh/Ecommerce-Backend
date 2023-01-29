const model = require("../model/promoBanner.model.js");

module.exports.createPromoBanner = async (req, res) => {
  const response = await model.createPromoBanner(req.body);
  console.log(response);
  if (response && "id" in response) {
    return res.successResponse("Banner created successfully", response);
  } else if (response && "already" in response) {
    return res.alreadyExistsResponse(response.already);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getPromoBanners = async (req, res) => {
  const { search } = req.body;
  const { page, limit } = req.query;
  const banners = await model.getAllPromoBanners(search, page, limit);
  if (banners && Array.isArray(banners)) {
    return res.successResponse("All Products fetched successfully", banners);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getPromoBannerById = async (req, res) => {
  const id = req.params.id;
  const response = await model.getPromoBannerById(id);
  if (response && "id" in response) {
    return res.successResponse("Banner fetched successfully", response);
  } else if (response && "notFound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getPromoBannerByKey = async (req, res) => {
  const key = req.params.key;
  const response = await model.getPromoBannerByKey(key);
  if (response && "id" in response) {
    return res.successResponse("Banner fetched successfully", response);
  } else if (response && "notFound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.updatePromoBanner = async (req, res) => {
  const id = req.params.id;
  const response = await model.updatePromoBanner(id, req.body);
  console.log(response);
  if (response && "id" in response) {
    return res.successResponse("Banner updated successfully", response);
  } else if (response && "already" in response) {
    return res.alreadyExistsResponse(response.already);
  } else if (response && "notFound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.deletePromoBanner = async (req, res) => {
  const id = req.params.id;
  const response = await model.deletePromoBanner(id, req.body);
  if (response && "data" in response) {
    return res.successResponse("Banner deleted successfully");
  } else if (response && "notFound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.deleteAllPromoBanners = async (req, res) => {
  const response = await model.deleteAllPromoBanners();
  if (response && "data" in response) {
    return res.successResponse("All Banners deleted successfully");
  }
  return res.internalErrorResponse("Something went wrong");
};
