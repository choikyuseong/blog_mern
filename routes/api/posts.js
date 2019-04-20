const express = require('express');
const router = express.Router();



// @router Get api/users/post
// @desc Tests users route
// @access Public
router.get('/test' , (req,res) => res.json({msg:'post'}));


module.exports = router;