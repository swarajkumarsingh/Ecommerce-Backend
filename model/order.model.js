/* eslint-disable prefer-promise-reject-errors */
const mongoose = require("mongoose");
const Razorpay = require("razorpay");

const User = require("../db/model/User.js");
const Order = require("../db/model/Order.js");
const Cart = require("../db/model/Cart.js");
const Coupon = require("../db/model/Coupon.js");
const Product = require("../db/model/Product.js");

const sendEmail = require("./../util/sendMail.js");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID_TEST,
  key_secret: process.env.RAZORPAY_KEY_SECRET_TEST,
});

module.exports.validateRazorpayPayment = (orderId, paymentId, signature) => {
  const payload = orderId + "|" + paymentId;
  const crypto = require("crypto");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET_TEST)
    .update(payload)
    .digest("hex");

  return expectedSignature === signature;
};

module.exports.verifyOrderPurchase = async (
  userId,
  orderId,
  paymentId,
  signature
) => {
  return new Promise(async (resolve) => {
    const sessionMongo = await mongoose.startSession();
    sessionMongo.startTransaction();

    await new User({
      name: "suresh",
      phone: 8989898989,
    }).save({ session: sessionMongo });

    await sessionMongo.commitTransaction();

    resolve();
  });
};

module.exports.get_all_paid_orders = async (page, limit) => {
  try {
    const mongoLimit = limit || 8;
    const mongoSkip = page ? (parseInt(page) - 1) * mongoLimit : 0;
    const query = [];
    // Add Pagination
    query.push(
      { $match: { status: "ORDER_PLACED" } },
      { $sort: { paidOn: 1 } },
      { $skip: mongoSkip },
      { $limit: mongoLimit }
    );
    return await Order.aggregate(query);
  } catch (error) {
    return { error };
  }
};

module.exports.get_all_pending_orders = async (page, limit) => {
  try {
    const mongoLimit = limit || 8;
    const mongoSkip = page ? (parseInt(page) - 1) * mongoLimit : 0;
    const query = [];
    // Add Pagination
    query.push(
      { $match: { status: "ORDER_PENDING_PAYMENT" } },
      { $sort: { paidOn: 1 } },
      { $skip: mongoSkip },
      { $limit: mongoLimit }
    );
    return await Order.aggregate(query);
  } catch (error) {
    return { error };
  }
};

module.exports.get_orders_of_user = async (id, page, limit) => {
  try {
    const mongoLimit = limit || 8;
    const mongoSkip = page ? (parseInt(page) - 1) * mongoLimit : 0;
    const query = [];
    // Add Pagination
    query.push(
      { $match: { userId: new mongoose.Types.ObjectId(id) } },
      { $sort: { paidOn: 1 } },
      { $skip: mongoSkip },
      { $limit: mongoLimit }
    );
    return await Order.aggregate(query);
  } catch (error) {
    return { error };
  }
};

module.exports.create_order = (userId, body) => {
  return new Promise(async (resolve) => {
    try {
      const { addressId, products } = body;

      // Check if Valid Product data was sent
      const userExists = await this.findIfUserAlreadyExists(userId);
      if (!userExists) return resolve({ notFound: "User Not Found" });

      const userAddress = await getUserAddressById(userId, addressId);
      const deliveryCharge = 100;

      if (
        !userAddress ||
        (!"data" in userAddress && !"_id" in userAddress.data)
      )
        return resolve({ notFound: "Address Not found" });

      // All of the items sent were valid
      products.map((product) => {
        if (
          mongoose.Types.ObjectId.isValid(product.id) &&
          typeof product.size === "string" &&
          typeof product.qty === "number" &&
          product.qty < 11 &&
          product.qty > 0 == false
        ) {
          return resolve({ error: `Invalid Request body sent by user.` });
        }
      });

      // Check If all products are valid

      const inventoryRequests = products.map(async (prod) =>
        this.getProductById(prod.id, {
          inventory: 1,
          stock: 1,
          price: 1,
          mrp: 1,
        })
      );

      products.forEach(async (product) => {
        const isProductInStock = await this.isProductInInventory(
          product.id,
          product.size,
          product.qty
        );

        if (!isProductInStock) {
          return resolve({ notFound: "Product out of stock" });
        }
      });

      Promise.all(inventoryRequests)
        .then(async (allInventories) => {
          products.forEach(async (product) => {
            const item = allInventories.find(
              (p) => p.id.toString() === product.id
            );
            if (item) {
              product.mrp = item.mrp;
              product.price = item.price;
            }
          });
          let totalMrp = 0;
          let totalPrice = deliveryCharge;

          // Total of all products in TotalPrice
          for (let index = 0; index < products.length; index++) {
            totalMrp += products[index].mrp * products[index].qty;
            totalPrice += products[index].price * products[index].qty;
          }

          const options = {
            amount: Number(totalPrice) * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: `rcpt_${userId
              .toString()
              .substr(-12)}_${new Date().getTime()}`,
          };

          if ("coupon" in body) {
            // ? Validate Coupon and decrease the amount
            const coupon = await Coupon.findOne({ code: req.body.coupon.code });

            // check 1: !coupon : Invalid coupon code
            if (!coupon) {
              return resolve({ error: "Invalid coupon code" });
            }

            // check 2: coupon.expiration < Date.now() : Coupon has expired
            if (coupon.expiration < Date.now()) {
              return resolve({ error: "Coupon has expired" });
            }

            // check 3: coupon.uses >= coupon.maxUses : Coupon has reached its maximum uses
            if (coupon.uses >= coupon.maxUses) {
              return resolve({
                error: "Coupon has reached its maximum uses",
              });
            }

            // If discount if greater than amount
            if (coupon.discount > options["amount"]) {
              // return resolve({ error: "Invalid coupon discount" });
            }

            // decrease discount amount from options.amount
            options["amount"] =
              Number(options["amount"]) - Number(coupon.discount);

            // UPDATE: uses:{$incr: 1}
            await Coupon.updateOne(
              { code: req.body.coupon.code },
              {
                $inc: { uses: 1 },
              }
            );
          }

          const productsToSave = products.map((product) => {
            return {
              itemId: new mongoose.mongo.ObjectId(product.id),
              size: product.size,
              qty: product.qty,
              purchaseMrp: product.mrp * product.qty,
              purchasePrice: product.price * product.qty,
            };
          });

          let razorpayData;

          try {
            razorpayData = await razorpay.orders.create(options);
          } catch (error) {
            return resolve({
              error: "Error from Payment Gateway, Please try after sometime.",
            });
          }

          if (!razorpayData || !"id" in razorpayData) {
            return resolve({
              error: "Error from Payment Gateway, Please try after sometime.",
            });
          }

          const order = await Order.create({
            userId: new mongoose.Types.ObjectId(userId),
            products: productsToSave,
            totalItems: productsToSave.length,
            totalPrice: totalPrice,
            billDetail: {
              itemCost: totalMrp,
              discount: totalMrp - totalPrice + deliveryCharge,
              referralDiscount: 0,
              deliveryCharges: deliveryCharge,
            },
            status: "ORDER_PENDING_PAYMENT",
            paymentInfo: {
              gateway: "razorpay",
              gatewayOrderId: razorpayData.id,
            },
            deliveryAddressId: addressId,
          });

          if (order && "userId" in order) {
            await User.updateOne(
              { _id: new mongoose.Types.ObjectId(userId) },
              { $inc: { orders: 1 } }
            );

            return resolve({ data: order.toObject() });
          }

          return resolve({
            error: `Error Creating Order, Please try after sometime.`,
          });
        })
        .catch((error) => {
          return resolve({ error });
        });
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getProductById = (itemId, projection) => {
  return new Promise((resolve, reject) => {
    Product.findOne(
      { _id: new mongoose.Types.ObjectId(itemId) },
      projection || {}
    )
      .exec()
      .then((data) => {
        if (data !== null) resolve(data);
        else reject();
      })
      .catch(() => reject());
  });
};

const getUserAddressById = async (userId, addressId) => {
  return new Promise((resolve) => {
    try {
      User.findOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        {
          addresses: {
            $elemMatch: { _id: new mongoose.Types.ObjectId(addressId) },
          },
        }
      )
        .exec()
        .then((data) => {
          if (data && "_id" in data) {
            if (
              "addresses" in data &&
              Array.isArray(data["addresses"]) &&
              data.addresses.length > 0
            ) {
              const lastUsedAddress = data.addresses[0];
              resolve({ data: lastUsedAddress.toObject() });
            } else {
              resolve({ notFound: true });
            }
          } else resolve({ notFound: true });
        })
        .catch((err) => {
          resolve({ error: err });
        });
    } catch (e) {
      resolve({ error: e });
    }
  });
};

module.exports.findIfUserAlreadyExists = async (userId) => {
  const user = await User.findOne({
    _id: new mongoose.Types.ObjectId(userId),
  });
  return user != null ? true : false;
};

module.exports.get_single_order = async (id) => {
  try {
    const order = await Order.findById(id);
    return order.toObject();
  } catch (error) {
    return { error };
  }
};

module.exports.get_all_orders = async (page, limit) => {
  try {
    const mongoLimit = limit || 8;
    const mongoSkip = page ? (parseInt(page) - 1) * mongoLimit : 0;
    const query = [];
    // Add Pagination
    query.push(
      { $sort: { _id: 1 } },
      { $skip: mongoSkip },
      { $limit: mongoLimit }
    );
    return await Order.aggregate(query);
  } catch (error) {
    return { error };
  }
};

module.exports.delete_all_orders = async () => {
  try {
    const orders = await Order.deleteMany();
    if (
      !orders ||
      !"acknowledged" in orders ||
      !"deletedCount" in orders ||
      orders.deletedCount > 1
    ) {
      return { error: "error while deleting all orders" };
    }

    return { data: "All Orders Deleted Successfully" };
  } catch (error) {
    return { error };
  }
};

module.exports.isProductInInventory = (itemId, itemSize, itemRequired) => {
  return new Promise((resolve) => {
    try {
      this.getProductInventory(itemId)
        .then((data) =>
          resolve(
            data &&
              Array.isArray(data) &&
              data.find(
                (s) => s.size === itemSize && s.items >= itemRequired
              ) != null
          )
        )
        .catch((err) => resolve(false));
    } catch (e) {
      resolve(false);
    }
  });
};

module.exports.getProductInventory = (itemId) => {
  return new Promise((resolve) => {
    try {
      Product.findOne(
        { _id: new mongoose.Types.ObjectId(itemId) },
        { inventory: 1 }
      )
        .exec()
        .then((data) => {
          if (
            data != null &&
            "inventory" in data &&
            Array.isArray(data["inventory"]) &&
            data["inventory"].length > 0
          ) {
            resolve(data["inventory"]);
          } else {
            resolve([]);
          }
        })
        .catch(() => resolve([]));
    } catch (e) {
      resolve([]);
    }
  });
};
