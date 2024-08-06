var express = require('express');
var router = express.Router();
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const passport = require('../config/auth');
require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');


// ROUTE SIGNUP
router.post('/signup', (req, res) => {
	if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ email: req.body.email }).then(data => {
    if (data === null) {
      const token = uid2(32);
      const hash = bcrypt.hashSync(req.body.password, 1);
      const newUser = new User({
        firstname: req.body.firstname,
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });

      newUser.save().then(data => {
        res.json({ result: true, user: data, token});
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

// ROUTE SIGNIN
router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ email: req.body.email})
  .then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      const token = uid2(32);
      const user = {
        firstname: data.firstname,
        name: data.name,
        email: data.email,
      }
      res.json({ result: true, user, token });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});


router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:3001/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3001/');
  });

module.exports = router;
