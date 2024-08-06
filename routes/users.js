var express = require('express');
var router = express.Router();
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');

router.get('/mail', (req, res) => {
  nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }
  
    console.log('Credentials obtained, sending message...');
  
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
  
    // Message object
    let message = {
        from: 'Sender Name <sender@example.com>',
        to: 'Recipient <recipient@example.com>',
        subject: 'Nodemailer is unicode friendly ✔',
        text: 'Hello to myself!',
        html: '<p><b>Hello</b> to myself!</p>'
    };
  
    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }
  
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });
  res.json({result: test})
})



/* const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'your@gmail.com',
      pass: 'yourpassword'
  }
}); */




// ROUTE SIGNUP
/* router.post('/signup', (req, res) => {
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
}); */

router.post('/signup', async (req, res) => {

})

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

module.exports = router;
