const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_hiwemQLcx1qO1R",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "HfZcqar5f5TEeFRnhscAwP9p",
});

const makeRandomString = (length) => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports.createRazorpayOrder = async (price, notes) => {
  const options = {
    amount: price * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: `rcpt_${new Date().getTime()}_${makeRandomString(5)}`,
    notes: notes,
  };
  const razorPayOrder = await razorpay.orders.create(options);
  return Promise.resolve(razorPayOrder);
};

// module.exports
//   .createRazorpayOrder(10, {
//     userId: "Some UserId",
//   })
//   .then((d) => console.log(d, `data`))
//   .catch((e) => console.error(e, `err`));

module.exports.getOrderPayment = async (orderId) => {
  const payments = await razorpay.orders.fetchPayments(orderId);
  const capturedPayment = payments.items.find(
    (payment) => payment["status"] === "captured"
  );
  return Promise.resolve(
    payments && capturedPayment && "id" in capturedPayment
      ? capturedPayment
      : undefined
  );
};

module.exports.isPaymentValid = (orderId, paymentId, signature) => {
  const payload = orderId + "|" + paymentId;
  const crypto = require("crypto");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest("hex");

  return expectedSignature === signature;
};
