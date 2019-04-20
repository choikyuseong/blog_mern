const express = require('express');
const router = express.Router();



// @router Get api/users/profile
// @desc Tests users route
// @access Public
router.get('/test' , (req,res) => res.json({msg:'profile'}));
module.exports = router;