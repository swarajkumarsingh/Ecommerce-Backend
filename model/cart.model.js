const Cart = require("../db/model/Cart.js");
const User = require("../db/model/User.js");
const Product = require("../db/model/Product.js");

const { checkIfProductExists } = require("../model/product.model.js");

const mongoose = require("mongoose");

module.exports.addCart = async (userId, productId, size, count) => {
  try {
    const product = await checkIfProductExists(productId);
    const user = await this.checkIfUserExists(userId);

    const isProductInStock = await this.isProductInInventory(
      productId,
      size,
      count
    );

    if (!isProductInStock) {
      return resolve({ notFound: "Product out of stock" });
    }

    if (!product) {
      return resolve({ notFound: "Product not found" });
    }

    if (!user) {
      return resolve({ notFound: "User not found" });
    }

    const cart = await Cart.create({
      userId,
      productId,
      size,
      count,
    });

    return cart.toObject();
  } catch (error) {
    return { error };
  }
};

module.exports.updateCart = (userId, productId, size, count) => {
  return new Promise(async (resolve) => {
    try {
      const product = await checkIfProductExists(productId);
      
      if (!product) {
        return resolve({ notFound: "Product not found" });
      }

      const user = await this.checkIfUserExists(userId);
      
      if (!user) {
        return resolve({ notFound: "User not found" });
      }
      
      const isProductInStock = await this.isProductInInventory(
        productId,
        size,
        count
      );

      if (!isProductInStock) {
        return resolve({ notFound: "Product out of stock" });
      }

      const cart = await Cart.findOneAndUpdate(
        { userId, productId },
        { size: size, count: qty },
        { new: true }
      );

      return resolve(cart.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.getMyCart = (userId) => {
  return new Promise(async (resolve) => {
    try {
      const cart = await Cart.find({ userId });

      if (!cart || !Array.isArray(cart)) {
        return resolve({ notFound: "User Not found" });
      }

      return resolve(cart.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.removeAllItem = (userId) => {
  return new Promise(async (resolve) => {
    try {
      const cart = await Cart.deleteMany({ userId });

      if (!cart || cart === null) {
        return resolve({
          error: "Error while removing all items from the cart.",
        });
      }

      return resolve({ data: "All Cart Items removed" });
    } catch (error) {
      resolve({ error });
    }
  });
};

module.exports.removeItem = (userId, productId) => {
  return new Promise(async (resolve) => {
    try {
      const product = await checkIfProductExists(productId);
      const user = await this.checkIfUserExists(userId);

      if (!product) {
        return resolve({ notFound: "Product not found" });
      }

      if (!user) {
        return resolve({ notFound: "User not found" });
      }

      const cart = await Cart.findOneAndDelete({ userId, productId });

      if (!cart || !"userId" in cart) {
        return resolve({ error: "error while removing item from cart" });
      }

      return resolve(cart.toObject());
    } catch (error) {
      resolve({ error });
    }
  });
};

// module.exports.checkIfProductExists = async (productId) => {
//   const product = await Product.findOne(
//     {
//       _id: new mongoose.Types.ObjectId(productId),
//     },
//     { _id: 0, name: 1 }
//   );
//   return product != null ? true : false;
// };

module.exports.checkIfUserExists = async (userId) => {
  const user = await User.findOne(
    {
      _id: new mongoose.Types.ObjectId(userId),
    },
    { _id: 0, name: 1 }
  );
  return user != null ? true : false;
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
            resolve({ error: "Error while fetching inventory of product" });
          }
        })
        .catch(() =>
          resolve({ error: "Error while fetching inventory of product" })
        );
    } catch (e) {
      resolve({ error });
    }
  });
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
