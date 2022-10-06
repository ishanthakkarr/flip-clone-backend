const Order = require("../models/order");
const Cart = require("../models/cart");
const Address = require("../models/address");
const Product = require("../models/product");
const Razorpay = require("razorpay");
const env = require("dotenv");
const crypto = require("crypto");

//environment variable or you can say constants

env.config();

//razorpay instance
const key_id = process.env.key_id;
const key_secret = process.env.key_secret;
const instance = new Razorpay({
  key_id,
  key_secret,
});

exports.addOrder = (req, res) => {
  Cart.deleteOne({ user: req.user._id }).exec((error, result) => {
    if (error) return res.status(400).json({ error });
    if (result) {
      req.body.user = req.user._id;
      req.body.razorPay = {
        isPaid: false,
        amount: 0,
        razorpay_payment_id: "",
        razorpay_order_id: "",
        razorpay_signature: "",
      };
      req.body.orderStatus = [
        {
          type: "ordered",
          date: new Date(),
          isCompleted: true,
        },
        {
          type: "packed",
          isCompleted: false,
        },
        {
          type: "shipped",
          isCompleted: false,
        },
        {
          type: "delivered",
          isCompleted: false,
        },
      ];
      const order = new Order(req.body);
      order.save((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) {
          res.status(201).json({ order });
        }
      });
    }
  });
};

exports.getOrder = (req, res) => {
  Order.findOne({ _id: req.body.orderId })
    .populate("items.productId", "_id name productPictures")
    .lean()
    .exec((error, order) => {
      if (error) return res.status(400).json({ error });
      if (order) {
        Address.findOne({
          user: req.user._id,
        }).exec((error, address) => {
          if (error) return res.status(400).json({ error });
          order.address = address.address.find(
            (adr) => adr._id.toString() == order.addressId.toString()
          );
          res.status(200).json({
            order,
          });
        });
      }
    });
};

exports.getOrders = (req, res) => {
  Order.find({ user: req.user._id })
    .select("_id paymentStatus items")
    .populate("items.productId", "_id name productPictures")
    .exec((error, orders) => {
      if (error) return res.status(400).json({ error });
      if (orders) {
        res.status(200).json({ orders });
      }
    });
};

exports.makePayment = (req, res) => {
  // console.log(req.body);
  const amount = req.body.totalAmount * 100;
  const currency = "INR";
  const receipt = "receipt#123";
  const notes = {
    desc: "Thank you!",
  };
  instance.orders.create(
    { amount, currency, receipt, notes },
    (error, order) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(order);
    }
  );
};

exports.verifySignature = async (req, res) => {
  // console.log(JSON.stringify(req.body));
  const hash = crypto
    .createHmac("SHA256", "Password@123")
    .update(JSON.stringify(req.body))
    .digest("hex");
  // console.log(hash);
  // console.log(req.headers['x-razorpay-signature']);
  if (hash === req.headers["x-razorpay-signature"]) {
    console.log("req.body.payload.payment ====> ",req.body.payload.payment);
    let _order = await Order.findOneAndUpdate(
      { _id: req.body.payload.payment.entity.notes.actual_order_id },
      {
          "paymentType": "cod",
          "paymentStatus": "completed",
          "razorPay": {
            "isPaid": true,
            "amount": req.body?.payload?.payment?.entity?.amount,
            // "razorpay_payment_id": req.body?.payment?.entity?.id,
            // "razorpay_order_id": req.body?.payment?.entity?.order_id,
            "razorpay_signature": hash
          }, 
      },
      {new : true}
    );
    console.log(_order);
    res.status(200);
  } else {
    //decline

    res.status(400);
  }
};
