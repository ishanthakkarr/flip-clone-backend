const express = require('express');
const router = express.Router();
const { addAddress, getAddress } = require('../controller/address');
const { requireSignin, userMiddleware } = require('../common-middleware');

router.post('/user/address/create', requireSignin, userMiddleware, addAddress);
router.post('/user/getaddress', requireSignin, userMiddleware, getAddress);

module.exports = router;