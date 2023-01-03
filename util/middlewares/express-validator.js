const { validationResult } = require("express-validator");

module.exports.requestValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(400).json({
    //   error: true,
    //   message: `Missing or Invalid Arguments ${errors.array().map((data) => {
    //     return data.param;
    //   })}`,
    // });
    return res.errorResponse(
      `Missing or Invalid Arguments ${errors.array().map((data) => {
        return data.param;
      })}`
    );
  } else {
    next();
  }
};
