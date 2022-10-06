const express = require('express');
const router = express.Router();
const { createPage, getProductPage } = require('../../controller/admin/page');
const { requireSignin, adminMiddleware,uploadS3 } = require('../../common-middleware');
const { upload } = require('../../common-middleware');

router.post('/page/create', requireSignin, adminMiddleware, uploadS3.fields([
    { name: 'banners' },
    { name: 'products' }
]), createPage);

router.get(`/page/:category/:type`, getProductPage);


module.exports = router;