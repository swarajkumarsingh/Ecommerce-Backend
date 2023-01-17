const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        itemId: { type: Schema.Types.ObjectId, required: true },
        size: { type: String, trim: true },
        quantity: { type: Number, default: 1 },
        purchaseMrp: { type: Number, require: true },
        purchasePrice: { type: Number, require: true },
        type: Schema.Types.Mixed,
      },
    ],
    totalItems: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    billDetail: {
      itemCost: { type: Number, required: true },
      discount: { type: Number, required: true },
      referralDiscount: { type: Number, default: 0 },
      deliveryCharges: { type: Number, default: 100 },
    },
    status: { type: String, default: "ORDER_PENDING_PAYMENT" },
    // ORDER_PENDING_PAYMENT,ORDER_PLACED, PREPARING_FOR_SHIPPING,DELIVERED,IN_TRANSIT,OUT_FOR_DELIVERY,DELIVERED,RETURN_PLACED, RETURN_OUT_FOR_PICKUP, PICK_UP_COMPLETE, PENDING_REFUND
    deliveredOn: { type: Date },
    paidOn: { type: Date },
    returnRequestedOn: { type: Date },
    returnCompletedOn: { type: Date },
    paymentInfo: {
      gateway: { type: String, required: true },
      gatewayOrderId: { type: String, required: true },
      gatewayPaymentId: { type: String },
      method: { type: String },
      amountPaid: { type: Number },
      currency: { type: String, default: "INR" },
      verificationData: { type: Schema.Types.Mixed },
    },
    deliveryAddressId: { type: String, required: true },
  },
  {
    timestamps: true,
    toObject: {
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

orderSchema.index({ paidOn: -1 });
orderSchema.index({ userId: 1, paidOn: -1 });

module.exports = mongoose.model("Order", orderSchema, "Order");
