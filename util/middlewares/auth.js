const User = require("../../db/model/User.js");

exports.authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    req.user = await User.findById(req.userId);
    if (
      !req.user ||
      req.user == false ||
      req.user.role == null ||
      !roles.includes(req.user.role || "user")
    ) {
      return res.status(400).json({ error: true, message: "UnAuthorized" });
    }
    next();
  };
};
