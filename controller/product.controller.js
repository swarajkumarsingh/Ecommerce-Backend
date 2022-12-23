const model = require("../model/product.model.js");

module.exports.createProduct = async (req, res) => {
  const product = await model.createProduct(req);
  if (product && "id" in product) {
    return res.successResponse("Product created successfully", product);
  }
  return res.internalErrorResponse("Something went wrong", product);
};

module.exports.getAllProduct = async (req, res) => {
  const { search } = req.body;
  const { page, limit } = req.query;
  const products = await model.getAllProduct(search, page, limit);
  if (products && Array.isArray(products)) {
    return res.successResponse("All Products fetched successfully", products);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getProduct = async (req, res) => {
  const pid = req.params.pid;
  const userId = req.userId;
  const product = await model.getProductById(userId, pid);
  if (product && "id" in product) {
    return res.successResponse("Product fetched successfully", product);
  } else if (response && "notFound" in response) {
    return res
      .status(404)
      .json({ error: true, message: "No user found with the given id" });
  }
  return resolve("Something went wrong");
};

module.exports.updateProduct = async (req, res) => {
  const pid = req.params.pid;
  const product = await model.updateProduct(pid, req.body);
  if (product && "id" in product) {
    return res.successResponse("Product fetched successfully", product);
  } else if (response && "notFound" in response) {
    return res
      .status(404)
      .json({ error: true, message: "No user found with the given id" });
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getProductViews = async (req, res) => {
  const pid = req.params.pid;
  const product = await model.getProductViews(pid);
  console.log(product);
  if (product && "id" in product) {
    return res.successResponse("Product fetched successfully", product);
  } else if (response && "notFound" in response) {
    return res
      .status(404)
      .json({ error: true, message: "No user found with the given id" });
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.deleteProduct = async (req, res) => {
  const pid = req.params.pid;
  const response = await model.deleteProduct(pid);
  if (response && "deletedCount" in response) {
    return res.successResponse(`User deleted successfully`);
  } else if (response && "notFound" in response) {
    return res
      .status(404)
      .json({ error: true, message: "No user found with the given id" });
  }
  res.internalErrorResponse("Something went wrong", response.error);
};
