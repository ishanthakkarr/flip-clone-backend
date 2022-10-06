const express = require('express')
const router = express.Router();
const { signup, signin , signout } = require('../../controller/admin/auth');
const { validateSigninRequest, validateSignupRequest, isRequestValidated } = require('../../validators/auth');
const { requireSignin } = require('../../common-middleware');



router.post('/admin/signin',validateSigninRequest, isRequestValidated, signin);
router.post('/admin/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/admin/signout',signout);


// router.post('/profile',requireSignin, (req, res) => {
//     res.status(200).json({ user : "profile" });
// });

module.exports = router;