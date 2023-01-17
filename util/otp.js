const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const axios = require("axios").default;

module.exports.sendOtp = async (phone, otp) => {
  return new Promise(async (resolve) => {
    const kaleyraAppId = process.env.KALEYRA_APP_ID;
    const kaleyraTemplateId = process.env.KALEYRA_TEMPLATE_ID;
    const kaleyraApiKey = process.env.KALEYRA_API_KEY;
    const url = `https://api.kaleyra.io/v1/${kaleyraAppId}/messages`;

    if (!phone || phone.length != 13) {
      return resolve({ error: "Envalid phone number" });
    }

    const payload = {
      to: phone,
      body: `<#> ${otp} is your verification code for one app app_hash_code - Radio Rocket`,
      sender: "RDRCKT",
      type: "OTP",
      template_id: kaleyraTemplateId,
    };
    const options = {
      headers: {
        "api-key": kaleyraApiKey,
      },
    };
    axios
      .post(url, payload, options)
      .then((body) => {
        resolve(body.data);
      })
      .catch((err) => {
        console.log(`Error sending otp: ${err}`);
        resolve({ error: err });
      });
  });
};

// module.exports
//   .sendOtp("+919934987239", 22323)
//   .then((d) => console.log(d))
//   .catch((e) => console.log(e));
