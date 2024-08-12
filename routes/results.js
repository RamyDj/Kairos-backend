var express = require('express');
var router = express.Router();
const User=require('../models/users')
const Search = require('../models/searches')

router.post('/registerSearch', async (req, res)=>{
    const {search, email} =req.body
    const newSearch = new Search(search)

    const data = await newSearch.save()

    await User.updateOne({email}, {$push:{searches : data._id}})

    const userData = await User.findOne({email}).populate('searches')
    const searches = userData.searches
    const allSearchesId =searches.map(e=>e=e._id)

    res.json({searches, allSearchesId})

})

module.exports = router;