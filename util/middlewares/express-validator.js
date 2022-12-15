const { validationResult } = require("express-validator");

module.exports.requestValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.errorResponse(
      `Missing or Invalid Arguments ${errors.array().map((data) => {
        return data.param;
      })}`
    );
  } else {
    next();
  }
};
