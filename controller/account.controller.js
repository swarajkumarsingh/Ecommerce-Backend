const model = require("../model/account.model");
const { createLoginToken } = require("../util/login");

module.exports.verify = async (req, res) => {
  const { phone } = req.body;

  // Create a new verify object
  const verification = await model.createVerificationSession(phone);
  if (!verification) {
    return res.errorResponse("Failed to send OTP");
  }
  // Send the OTP
  const otpRequest = await model.sendOtp(verification.source, verification.otp);
  if (!otpRequest.id) {
    return res.errorResponse("Failed to send OTP", 400, otpRequest.error);
  }

  // Send the verify id to user
  return res.successResponse("OTP sent successfully.", { id: verification.id });
};

module.exports.login = async (req, res) => {
  const { verifyId, otp, phone } = req.body;

  // Check for valid verification
  const verification = await model.getVerification(verifyId);
  if (
    !verification ||
    !verification._id ||
    !verification.otp ||
    !verification.source ||
    verification.otp !== otp ||
    verification.source !== phone
  ) {
    return res.errorResponse("Invalid Verify Id");
  }

  // Get or Create user based on request body
  const user = await model.getOrCreateUser(req.body);

  // Generate Firebase login token
  const token = await createLoginToken(user.id, { phone });
  user["token"] = token;

  const state = user.new ? "Signed up" : "Logged in";
  return res.successResponse(`User ${state} Successfully.`, user);
};
