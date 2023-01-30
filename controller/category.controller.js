const model = require("../model/category.model.js");

module.exports.createCategory = async (req, res) => {
  const userId = req.userId;
  const response = await model.createCategory(userId, req.body);
  if (response && "id" in response) {
    return res.successResponse("Category created successfully", response);
  } else if (response && "already" in response) {
    return res.alreadyExistsResponse(response.already);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.updateCategory = async (req, res) => {
  const id = req.params.id;
  const response = await model.updateCategory(id, req.body);
  if (response && "id" in response) {
    return res.successResponse("Category created successfully", response);
  } else if (response && "already" in response) {
    return res.alreadyExistsResponse(coupon.already);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getCategory = async (req, res) => {
  const id = req.params.id;
  const response = await model.getCategory(id);
  if (response && "id" in response) {
    return res.successResponse("Category fetched successfully", response);
  } else if (response && "notFound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getCategoryByName = async (req, res) => {
  const name = req.params.name;
  const response = await model.getCategoryByName(name);
  if (response && "id" in response) {
    return res.successResponse("Category created successfully", response);
  } else if (response && "notFound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getCategories = async (req, res) => {
  const { search } = req.body;
  const { page, limit } = req.query;
  const products = await model.getCategories(search, page, limit);
  if (products && Array.isArray(products)) {
    return res.successResponse("All Products fetched successfully", products);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getProductsByCategory = async (req, res) => {
  const id = req.params.id;
  const { page, limit } = req.query;
  const products = await model.getProductsByCategory(id, page, limit);
  if (products && Array.isArray(products)) {
    return res.successResponse("All Products fetched successfully", products);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.deleteCategories = async (req, res) => {
  const products = await model.deleteCategories();
  if (products && "data" in products) {
    return res.successResponse("All Categories deleted successfully");
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.deleteCategory = async (req, res) => {
  const id = req.params.id;
  const response = await model.deleteCategory(id);
  if (response && "data" in response) {
    return res.successResponse("Category deleted successfully");
  } else if (response && "notFound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  return res.internalErrorResponse("Something went wrong");
};
