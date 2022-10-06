const express = require('express');
const router = express.Router();
const { addCategory, getCategory, updateCategories ,deleteCategories } = require('../controller/category');
const { requireSignin, adminMiddleware,uploadS3 } = require('../common-middleware');

const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + '-' + file.originalname);
    }
})
const upload = multer({ storage });

router.post('/category/create', requireSignin, adminMiddleware, uploadS3.single('categoryImage'), addCategory);
router.get('/category/getcategory', getCategory);
router.post('/category/update',requireSignin, adminMiddleware, upload.array('categoryImage'), updateCategories);
router.post('/category/delete',requireSignin, adminMiddleware, deleteCategories);

module.exports = router;