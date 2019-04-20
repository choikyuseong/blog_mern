const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const authcheck = passport.authenticate('jwt', {session : false});


//
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');



// Load User Model
const userModel = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));


// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {

    const {errors , isValid} = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    userModel
        .findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                // return res.status(400).json({
                //     email: 'Email already exists'
                // });
                errors.email = 'Email already exists';
                return res.status(400).json(errors);

            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // size
                    r: 'pg',  // Rating
                    d: 'mm'   // Default
                });
                const newUser = new userModel({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => res.json(err));
                    });
                });

                // newUser.save()
                // .then(user => res.json(user));

            }
        })
        .catch(err => res.json(err));
});


// @route   post api/users/login
// @desc    login user/ returning JWT
// @access  Public
router.post('/login' ,(req, res) =>{

    const { errors , isValid} = validateLoginInput(req.body);
    //check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password =req.body.password;

    //find user by email
    userModel.findOne({email})
        .then(user => {
            if (!user) {
                // return res.status(404).json({
                //     email: 'User not found'
                // });
                errors.email = 'users not found';
                return res.status(404).json(errors);
            }

            bcrypt
                .compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //res.json({ msg : 'Success'});

                        //user matched
                        const payload = {id: user.id , name:user.name , avator:user.avator};

                        //sign token
                        jwt.sign(
                            payload,
                            keys.secretOrkey,
                            { expiresIn : 3600},
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            }
                        )
                    } else {
                        // return res.status(400).json({
                        //     password: 'password incorrect'
                        // });
                        errors.password = 'password incorrect';
                        return res.status(404).json(errors);

                    }
                })
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
});

// @route   GET api/users/current
// @desc    return current user
// @access  private
router.get('/current' , authcheck , (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});



module.exports = router;