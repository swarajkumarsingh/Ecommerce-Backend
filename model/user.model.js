const User = require("../db/model/User.js");

module.exports.createUser = async (body) => {
  return new Promise(async (resolve) => {
    try {
      const { name, email, password, address} = body;

      const userExists = await User.findOne({ email });
      if (userExists && "id" in userExists) {
        resolve({ error: `User with email:${email} already exists` });
      }

      const user = await User.create({
        name,
        email,
        password,
        address,
      });

      console.log("Hello", user);
      resolve(user);
    } catch (error) {
      resolve({ error: error });
    }
  });
};
