const model = require("../model/product.model.js");

module.exports.createProduct = async (req, res) => {
  const product = await model.createProduct(req);
  if (product && "id" in product) {
    return res.successResponse("Product created successfully", product);
  }
  return res.internalErrorResponse("Something went wrong", product);
};

module.exports.getAllProduct = async (req, res) => {
  const products = await model.getAllProduct();
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
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.updateProduct = async (req, res) => {
  const pid = req.params.pid;
  const product = await model.updateProduct(pid, req.body);
  if (product && "id" in product) {
    return res.successResponse("Product fetched successfully", product);
  }
  return res.internalErrorResponse("Something went wrong");
};
