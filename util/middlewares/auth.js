const User = require("../../db/model/User.js");

exports.isAuthenticated = () => {
  return async (req, res, next) => {
    const a = await User.findById(req.userId);
    if (req.userId === "" || req.userId === null || a === null) {
      return res
        .status(400)
        .json({ error: true, message: "Admin accessed route" });
    }
    next();
  };
};

exports.authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    req.user = await User.findById(req.userId);
    if (
      !req.user ||
      req.user == false ||
      req.user.role == null ||
      !roles.includes(req.user.role || "user")
    ) {
      return res
        .status(400)
        .json({ error: true, message: "User not Authenticated" });
    }
    next();
  };
};
