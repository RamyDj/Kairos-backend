var express = require('express');
var router = express.Router();
const User=require('../models/users')

router.post('/getSearches', async(req, res)=>{
const data = await User.findOne({email : req.body.email}).populate('searches')
console.log(data)
if (data){
    res.json({result : true, searches : data.searches})
}
else {res.json({result : false})}
})


module.exports = router