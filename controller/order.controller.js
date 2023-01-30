const model = require("../model/order.model.js");

module.exports.create_order = async (req, res) => {
  const userId = req.userId;
  const response = await model.create_order(userId, req.body);
  console.log(response);
  if (response && "data" in response) {
    return res.successResponse("Order created successfully", response);
  } else if (response && "notFound" in response) {
    return res.notFoundResponse(response.notFound);
  } else if (response.error === undefined)
    return res.internalErrorResponse("Product not found");
  return res.internalErrorResponse(response.error);
};

module.exports.get_all_orders = async (req, res) => {
  const { page, limit } = req.query;
  const response = await model.get_all_orders(page, limit);
  if (response && Array.isArray(response)) {
    return res.successResponse("Order created successfully", response);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.get_all_paid_orders = async (req, res) => {
  const { page, limit } = req.query;
  const response = await model.get_all_paid_orders(page, limit);
  if (response && Array.isArray(response)) {
    return res.successResponse(
      "All Paid Orders fetched successfully",
      response
    );
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.get_all_pending_orders = async (req, res) => {
  const { page, limit } = req.query;
  const response = await model.get_all_pending_orders(page, limit);
  if (response && Array.isArray(response)) {
    return res.successResponse(
      "All Pending Orders fetched successfully",
      response
    );
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.get_orders_of_user = async (req, res) => {
  const uid = req.params.uid;
  const { page, limit } = req.query;
  const response = await model.get_orders_of_user(uid, page, limit);
  if (response && Array.isArray(response)) {
    return res.successResponse("Orders fetched successfully", response);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.get_my_orders = async (req, res) => {
  const userId = req.userId;
  const { page, limit } = req.query;
  const response = await model.get_orders_of_user(userId, page, limit);
  if (response && Array.isArray(response)) {
    return res.successResponse("Orders fetched successfully", response);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.delete_all_orders = async (req, res) => {
  const response = await model.delete_all_orders();
  if (response && "data" in response) {
    return res.successResponse(response.data);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.get_single_order = async (req, res) => {
  const oid = req.params.oid;
  const response = await model.get_single_order(oid);
  if (response && "id" in response) {
    return res.successResponse("Order fetched successfully", response);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.verify_purchase = async (req, res) => {
  const userId = req.userId;
  const orderId = req.body.orderId;
  const paymentId = req.body.paymentId;
  const signature = req.body.signature;

  const response = await model.verifyOrderPurchase(
    userId,
    orderId,
    paymentId,
    signature
  );
  if (response && "data" in response) {
    return res.successResponse("Order Verified successfully", response.data);
  } else if (response && "notFound" in response) {
    return res.notFoundResponse(response.notFound);
  }
  return res.internalErrorResponse(response.error);
};
