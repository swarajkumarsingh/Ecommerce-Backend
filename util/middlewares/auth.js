const User = require("../../db/model/User.js");
const Seller = require("../../db/model/Seller.js");

exports.authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    if (roles.includes("seller")) {
      req.sellerUser = await Seller.findById(req.userId);
      if (
        !req.sellerUser ||
        req.sellerUser == false ||
        req.sellerUser == null ||
        req.name == null
      ) {
        return res
          .status(400)
          .json({ error: true, message: "Seller UnAuthorized" });
      }
      next();
    } else {
      req.adminUser = await User.findById(req.userId);
      if (
        !req.adminUser ||
        req.adminUser == false ||
        req.adminUser.role == null ||
        !roles.includes(req.adminUser.role || "user")
      ) {
        return res
          .status(400)
          .json({ error: true, message: "Admin UnAuthorized" });
      }
      next();
    }
  };
};

exports.isSellerID = () => {
  return async (req, res, next) => {
    req.sellerUser = await Seller.findById(req.userId);
    if (
      !req.sellerUser ||
      req.sellerUser == false ||
      req.sellerUser == null ||
      req.name == null
    ) {
      return res
        .status(400)
        .json({ error: true, message: "Seller UnAuthorized" });
    }
    next();
  };
};
