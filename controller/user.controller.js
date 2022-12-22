const model = require("../model/user.model.js");

module.exports.createUser = async (req, res) => {
  const user = await model.createUser(req.body);
  if (user && "id" in user) {
    return res.successResponse("User created successfully", user);
  }
  return res.internalErrorResponse("Something went wrong");
};

module.exports.updateProfile = async (req, res) => {
  const userId = req.userId;
  const response = await model.updateUser(userId, req.body);
  if (response && "data" in response) {
    return res.successResponse("Account Updated", response.data);
  }
  res.internalErrorResponse("Something went wrong");
};

module.exports.updateUser = async (req, res) => {
  const userId = req.params.uid;
  const response = await model.updateUserByAdmin(userId, req.body);
  if (response && "data" in response) {
    return res.successResponse("Account Updated", response.data);
  }
  res.internalErrorResponse("Something went wrong");
};

module.exports.updateUserRole = async (req, res) => {
  const userId = req.params.uid;
  const response = await model.updateUserRole(userId, req.body);
  if (response && "data" in response) {
    return res.successResponse("Account Role Updated", response.data);
  }
  res.internalErrorResponse("Something went wrong");
};

module.exports.getMyProfile = async (req, res) => {
  const userId = req.userId;
  const user = await model.findUserById(userId);
  if (user && "id" in user) {
    return res.successResponse("Fetched My Profile Info", user);
  }
  res.internalErrorResponse("Something went wrong");
};
1;
module.exports.deleteUser = async (req, res) => {
  const userId = req.params.uid;
  const response = await model.deleteUser(userId);
  if (response && "data" in response && "user" in response) {
    return res.successResponse(
      `User with id ${userId} deleted successfully`,
      response.user
    );
  }
  res.internalErrorResponse("Something went wrong", response.error);
};

module.exports.getUser = async (req, res) => {
  const userId = req.params.uid;
  const user = await model.findUserById(userId);
  if (user && "id" in user) {
    return res.successResponse("Fetched My Profile Info", user);
  }
  res.internalErrorResponse("Something went wrong");
};

module.exports.getUserRole = async (req, res) => {
  const userId = req.params.uid;
  const user = await model.findUserRoleById(userId);
  if (user && "role" in user) {
    return res.successResponse("User Role Fetched Successfully", {
      role: user.role,
    });
  }
  res.internalErrorResponse("Something went wrong");
};

module.exports.getUsers = async (req, res) => {
  const { search } = req.body;
  const { page, limit } = req.query;
  const users = await model.getUsers(search, page, limit);
  if (users && Array.isArray(users)) {
    return res.successResponse("Users fetched successfully.", users);
  }
  res.internalErrorResponse("Something went wrong");
};
