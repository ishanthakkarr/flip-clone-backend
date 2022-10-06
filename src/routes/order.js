const { requireSignin, userMiddleware } = require("../common-middleware");
const {
  addOrder,
  getOrders,
  getOrder,
  makePayment,
  verifySignature
} = require("../controller/order");
const router = require("express").Router();

router.post("/addOrder", requireSignin, userMiddleware, addOrder);
router.get("/getOrders", requireSignin, userMiddleware, getOrders);
router.post("/getOrder", requireSignin, userMiddleware, getOrder);
router.post("/makePayment", requireSignin, userMiddleware, makePayment);
router.post("/verify/razorpay-signature",verifySignature);

module.exports = router;
