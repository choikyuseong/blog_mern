const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//lord validation
const validateProfileInput = require('../../validation/profile');
const validateEducationInput = require('../../validation/education');
const validateExperienceInput = require('../../validation/experience');

const profileModel = require('../../models/Profile');
const userModel = require('../../models/User');

const authCheck = passport.authenticate('jwt', { session: false });



// @route   GET api/profile/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));


// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get('/', authCheck, (req, res) => {

    const errors = {};

    profileModel.findOne({ user: req.user.id })
        .populate('users' , ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.json(err));

});


// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post('/', authCheck, (req, res) => {

    const { errors, isValid } = validateProfileInput(req.body);

    // check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    profileModel.findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
                // update
                profileModel
                    .findOneAndUpdate(
                        { user: req.user.id },
                        { $set: profileFields },
                        { new: true }
                    )
                    .then(profile => res.json(profile))
                    .catch(err => res.json(err));
            } else {
                // check if handle exists
                profileModel
                    .findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if (profile) {
                            errors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }
                        new profileModel(profileFields)
                            .save()
                            .then(profile => res.json(profile))
                            .catch(err => res.json(err));
                    })
                    .catch(err => res.json(err));
            }
        })
        .catch(err => res.json(err));
});



// router Get api/profile/all
// desc Get all profiles
// access public

router.get('/all' , (req, res) => {

    const error = {};
    profileModel.find()
        .populate('user' , ['name','avator'])  //어떤 정보를 불러올거냐 select
        .then(profiles => {
            if (!profiles){
                errors.noprofile = 'there is no profiles';
                return res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(err => res.status(404).json({
            profile: 'there is no profile'
        }));



});

// router GET api/profile/handle/:handle
// desc Get profile by handle
// access public

router.get('/handle/:handle' , (req, res ) => {

    const errors = {};
    profileModel.findOne({handle : req.params.handle})
        .populate('user' , ['name','avator'])  //어떤 정보를 불러올거냐 select
        .then(profiles => {
            if (!profiles){
                errors.noprofile = 'there is no profiles for this user';
                return res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(err => res.status(404).json({
            profile: err
        }));

});

// router GET api/profile/user/:user_id
// desc Get profile by user ID
// access public

router.get('/user/:user_id' , (req, res ) => {

    const errors = {};
    profileModel.findOne({user : req.params.user_id})
        .populate('user' , ['name','avator'])  //어떤 정보를 불러올거냐 select
        .then(profile => {
            if (!profile){
                errors.noprofile = 'there is no profiles for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({
            profile: err
        }));

});

// router POST api/profile/experience
// desc add experience to profile
// access public

router.post('/experience' , (req, res) => {

    const {errors, isValid} = validateExperienceInput(req.body);

    //check validation
    if (!isValid) {
        return res.status(404).json(errors);
    }



    profileModel.findOne({user : req.user.id})
        .then(profile => {
            const newExp ={
                title: req.body.title,
                company:req.body.company,
                location:req.body.location,
                from:req.body.from,
                to:req.body.to,
                current:req.body.current,
                description:req.body.description

            };


            //add to exp array
            profileModel.experience.unshift(newExp);
            profileModel
                .save()
                .then(profile => res.json(profile))
                .catch(err => res.status(404).json(err))

        })
        .catch(err = res.status(404).json(err));


});



// router POST api/profile/education
// desc add education to profile
// access public

router.post('/education' , (req, res) => {
    const {errors , isValid} = validateEducationInput(req.body);
    //check validation
    if (!isValid) {
        return res.status(404).json(errors);
    }

    profileModel.findOne({user : req.user.id})
        .then(profile => {
            const newEdu ={
                school: req.body.school,
                degree:req.body.degree,
                fieldofstudy:req.body.fieldofstudy,
                from:req.body.from,
                to:req.body.to,
                current:req.body.current,
                description:req.body.description

            };


            //add to exp array
            profileModel.education.unshift(newEdu);
            profileModel
                .save()
                .then(profile => res.json(profile))
                .catch(err => res.status(404).json(err))

        })
        .catch(err = res.status(404).json(err));


});


module.exports = router;