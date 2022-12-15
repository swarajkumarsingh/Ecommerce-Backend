const model = require("../model/user.model.js");

module.exports.createUser = async (req, res) => {
  const user = await model.createUser(req.body);
  if (user && "id" in user) {
    return res.successResponse("User created successfully", user._doc);
  }
  res.internalErrorResponse(user.error);
};