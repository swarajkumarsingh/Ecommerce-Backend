const model = require("../model/coupon.model.js");

module.exports.createCoupon = async (req, res) => {
  const userId = req.userId;
  const coupon = await model.createCoupon(userId, req.body);
  if (coupon && "id" in coupon) {
    return res.successResponse("Coupon created successfully", coupon);
  } else if (coupon && "already" in coupon) {
    return res.alreadyExistsResponse(coupon.already);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.getAllCoupons = async (req, res) => {
  const { search } = req.body;
  const { page, limit } = req.query;
  const coupons = await model.getAllCoupons(search, page, limit);
  if (coupons && Array.isArray(coupons)) {
    return res.successResponse("All Coupons fetched successfully.", coupons);
  }
  res.internalErrorResponse("Something went wrong");
};

module.exports.updateCoupon = async (req, res) => {
  const id = req.params.id;
  const coupons = await model.updateCoupon(id, req.body);
  if (coupons && Array.isArray(coupons)) {
    return res.successResponse("All Coupons fetched successfully.", coupons);
  }
  res.internalErrorResponse("Something went wrong");
};

module.exports.getCouponById = async (req, res) => {
  const id = req.params.id;
  const coupon = await model.getCouponById(id);
  if (coupon && "id" in coupon) {
    return res.successResponse("Coupon fetched successfully.", coupon);
  } else if (coupon && "notFound" in coupon) {
    return res.notFoundResponse(coupon.notFOund);
  }
  res.internalErrorResponse("Something went wrong");
};

module.exports.getCouponByCode = async (req, res) => {
  const code = req.params.code;
  const coupon = await model.getCouponByCode(code);
  if (coupon && "id" in coupon) {
    return res.successResponse("Coupon fetched successfully.", coupon);
  } else if (coupon && "notFound" in coupon) {
    return res.notFoundResponse(coupon.notFOund);
  }
  res.internalErrorResponse("Something went wrong");
};

module.exports.deleteCouponById = async (req, res) => {
  const id = req.params.id;
  const coupon = await model.deleteCouponById(id);
  if (coupon && "data" in coupon) {
    return res.successResponse("Coupon deleted successfully.", coupon);
  } else if (coupon && "notFound" in coupon) {
    return res.notFoundResponse(coupon.notFOund);
  }
  res.internalErrorResponse("Something went wrong");
};

module.exports.deleteCouponByCode = async (req, res) => {
  const code = req.params.code;
  const coupon = await model.deleteCouponByCode(code);
  if (coupon && "data" in coupon) {
    return res.successResponse("Coupon deleted successfully.", coupon);
  } else if (coupon && "notFound" in coupon) {
    return res.notFoundResponse(coupon.notFOund);
  }
  res.internalErrorResponse("Something went wrong");
};

module.exports.deleteAllCoupons = async (req, res) => {
  const coupon = await model.deleteAllCoupons();
  if (coupon && "data" in coupon) {
    return res.successResponse("Coupon deleted successfully.", coupon);
  }
  res.internalErrorResponse("Something went wrong");
};
