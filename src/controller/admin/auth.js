const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcypt = require('bcrypt');
const shortid = require('shortid');
exports.signup = (req, res) => {
    User.findOne({ email: req.body.email })
        .exec(async (error, user) => {
            if (user) return res.status(400).json({
                message: 'Admin already registered'
            });

            const {
                firstName,
                lastName,
                email,
                password
            } = req.body;
            const hash_password = await bcypt.hash(password,10);
            const _user = new User({
                firstName,
                lastName,
                email,
                hash_password,
                username: shortid.generate(),
                role: 'admin'
            })


            _user.save((error, data) => {
                if (error) {
                    return res.status(400).json({
                        message: error
                    })
                }
                if (data) {
                    return res.status(201).json({
                        message: "Admin created Successfully...!"
                    })
                }
            });
        });
}

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email })
        .exec(async (error, user) => {
            if (error) return res.status(400).json({ error });
            if (user) {
                const isPassword = await user.authenticate(req.body.password);
                if (isPassword && user.role === 'admin') {

                    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
                    const { _id, firstName, lastName, email, role, fullName } = user;
                    res.cookie('token', token, { expiresIn: '30d' });
                    res.status(200).json({
                        token,
                        _id, firstName, lastName, email, role, fullName
                    })
                } else {
                    return res.status(400).json({
                        message: 'Invalid Password'
                    })
                }
            } else {
                return res.status(400).json({ message: "Somthing went wrong" });
            }

        });
}

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        message:'Signout successfully...!'
    })
}