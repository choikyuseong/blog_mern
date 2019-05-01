const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//post model
const postModel = require('../../models/Post');

//profile model
const profileModel = require('../../models/Profile');


// Validate
const validatePostInput = require('../../validation/posts');




const authCheck = passport.authenticate('jwt' , {session : false});


// @router Get api/users/post
// @desc Tests users route
// @access Public
//router.get('/test' , (req,res) => res.json({msg:'post'}));


// router Post api/posts
// desc Create post
// access Private

router.post('/' , authCheck ,  (req, res) => {
    const {errors , isValid} = validatePostInput(req.body);

    //check validation
    if (!isValid) {
        return res.status(404).json(errors);
    }


    const newPost = new postModel({
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.avatar,
        user:req.user.id
    });

    newPost.save()
        .then(post => res.json(post))
        .catch(err => res.status(404).json(err));
});





//router Get api/posts/
// desc get posts
// access public

// router.get('/' , (req, res) => {
//      postModel.find()
//          .sort({date: -1})
//          .then( posts => res.json(posts))
//          .catch(err = res.status(404).json(err));
// });

router.get('/', (req, res) => {
    postModel.find()
        .sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});




// router Get api/posts/:id
// desc Get post by id
// access public

router.get('/:id' ,(req, res) =>{

    postModel.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({
            nopostfound: 'no posts found with that id'
        }));
});


// router Delete api/post/:id
// desc Delete post by id
// access public

router.delete('/:id', authCheck, (req, res) => {
    profileModel.findOne({ user: req.user.id }).then(profile => {
        postModel.findById(req.params.id)
            .then(post => {
                // check for post owner
                if (post.user.toString() !== req.user.id) {
                    return res
                        .status(401)
                        .json({ noauthorized: 'User not authorized'});
                }
                post.remove().then(() => res.json({ success: true }));
            })
            .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
    });
});



//router  Post api/posts/like/:id
// desc like post
// access private

router.post('/like/:id' , authCheck ,(req , res) => {

    profileModel.findOne({ user : req.user.id})
        .then(profile => {
            postModel.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({ alreadyliked: 'user already liekd this post'})
                    }
                    //add user id to likes array
                    post.likes.unshift({ user:req.user.id});
                    post.save().then( post => res.json(post));
                })
                .catch(err => res.status(404).json(err));
        })
        .catch(err => res.status(404).json(err));
});

//router  Post api/posts/unlike/:id
// desc unlike post
// access private

router.post('/unlike/:id' , authCheck , (req, res) => {
    profileModel
        .findOne({ user : req.user.id})
        .then(profile => {
            postModel.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like=> like.user.toString() === req.user.id).length === 0 ){
                        return res.status(400).json({
                            notliked : 'you have not liked this post'
                        });
                    }

                    // get remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                    //splice out of array
                    post.likes.splice(removeIndex, 1);

                    //save
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({
                    postnotfound : 'no post found'
                }));
        });

});






module.exports = router;