const express = require("express");
const router = express.Router();
// const { addCategory, getCategory } = require('../controller/category');
const {
  createProduct,
  getProductByslug,
  getProductDetailsById,
  deleteProductById,
  getProducts
} = require("../controller/product");
const { requireSignin, adminMiddleware,uploadS3 } = require("../common-middleware");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  uploadS3.array("productPicture"),
  createProduct
);
router.get("/products/:slug", getProductByslug);
router.get("/product/:productId", getProductDetailsById);
router.delete(
  "/product/deleteProductById",
  requireSignin,
  adminMiddleware,
  deleteProductById
);
router.post(
  "/product/getProducts",
  requireSignin,
  adminMiddleware,
  getProducts
);

// router.get('/category/getcategory',getCategory);

module.exports = router;
