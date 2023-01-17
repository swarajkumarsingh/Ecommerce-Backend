const User = require("../db/model/User");
const Verification = require("../db/model/Verification");
const Otp = require("../util/otp");

const getRandomOtp = () => {
  return 200000 + Math.floor(Math.random() * 800000);
};

module.exports.createVerificationSession = async (phone) => {
  return new Verification({
    source: phone,
    otp: getRandomOtp(),
  }).save();
};

module.exports.sendOtp = async (phone, otp) => {
  return Otp.sendOtp(phone, otp);
};

module.exports.getVerification = async (id) => {
  return Verification.findOne({ _id: id });
};

module.exports.checkIfUserExists = async (phone) => {
  return await User.exists({ phone });
};

module.exports.findUserByPhone = async (phone) => {
  return JSON.parse(JSON.stringify(await User.findOne({ phone })));
};

module.exports.createAccount = async (body) => {
  const { phone } = body;
  return JSON.parse(
    JSON.stringify(
      await new User({
        phone,
      }).save()
    )
  );
};

module.exports.getOrCreateUser = async (body) => {
  return new Promise(async (resolve, reject) => {
    let user = await this.findUserByPhone(body.phone);
    if (user && "id" in user) {
      user.new = false;
      return resolve(user);
    }
    user = await this.createAccount(body);
    user.new = true;
    resolve(user);
  });
};
