var express = require('express');
var router = express.Router();
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const passport = require('../config/auth');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');

const ourEmail = process.env.EMAIL;
const ourPassword = process.env.EMAIL_PASSWORD

const EMAIL_SECRET = 'asdf1093KMnzxcvnkljvasdu09123nlasdasdf';

/* router.get('/mail', (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "agent.smiles.ss@gmail.com",
      pass: "fgulzynygqxfsmng",
    },
  });

  const EMAIL_SECRET = 'asdf1093KMnzxcvnkljvasdu09123nlasdasdf';

  const emailToken = jwt.sign({
    email: user.email
}, EMAIL_SECRET, { expiresIn: '1h' });

  const mailOptions = {
    from: "your_email@gmail.com",
    to: "sarah.saker@hotmail.fr",
    subject: "Hello from Nodemailer",
    text: "This is a test email sent using Nodemailer.",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });

  res.json({result: 'test'})
}) */

// ROUTE SIGNUP AVEC VERIFICATION MAIL
router.post('/signup', (req, res) => {
	if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ email: req.body.email }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 1);
      const newUser = new User({
        firstname: req.body.firstname,
        name: req.body.name,
        email: req.body.email,
        password: hash,
        skills: [],
        last_connection: new Date(),
        searches: [],
        verified: false,
      });

      newUser.save().then(data => {

         // SETUP COMPTE ENVOI DES MAILS CONFIRMATION
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: ourEmail,
          pass: ourPassword,
        },
      });

        // SETUP TOKEN A ENVOYER AU USER
      const emailToken = jwt.sign({
        userId: data._id
    }, EMAIL_SECRET, { expiresIn: '1h' });

    // URL ROUTE GET POUR CONFIRMER MAIL
    const url = `http://localhost:3000/users/confirmation/${emailToken}`

    // MAIL ENVOYE
    const mailOptions = {
      from: "your_email@gmail.com",
      to: newUser.email,
      subject: "KAIROS - Confirmation",
      text: `Click the link to confirm : <a href=${url}> ${url} </a>`,
    };
  

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });

    const user = {
      firstname: data.firstname,
      name: data.name,
      email: data.email,
      skills: data.skills,
      last_connection: data.last_connection,
      searches: data.searches,
    }

        res.json({ result: true, user});
      });
    } 
    
    else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

//ROUTE CONFIRMATION EMAIL
router.get('/confirmation/:token', (req, res) => {

  // Récupérer l'ID du User avec jwt
  const user = jwt.verify(req.params.token, EMAIL_SECRET);
  const userId = user.userId;
  console.log(userId)

  // Modifier le champ verified du document User
  User.updateOne({_id: userId}, {verified: true})
  .then((data) => {
    // Si Update n'a pas modifié de document
  if (data.modifiedCount === 0) {
      User.findById(userId).then(user => {
        if (user) {
          res.json({result: false, error: 'Email already verified'})
        }
      })
    } 

    User.findById(userId)
    .then(data => {
      if (data.verified === true) {
      res.redirect('http://localhost:3001/mailconfirm')
      /* const token = uid2(32);
      res.json({result: true, user: data, token}) */
      }
      else {
        res.json({result: false, error: 'Email not verified'})
      } 
      res.json({result: 'test', data})
    })
    
  })
  
})

// ROUTE CREATION TOKEN APRES CONFIRMATION MAIL
router.get('/token', (req, res) => {
  const token = uid2(32);
  res.json({token})
})


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

// ROUTE DELETE USER ACCOUNT
router.delete('/', (req, res) => {
  User.deleteOne({email: req.body.email})
  .then((data) => {
    data.deletedCount > 0 ? res.json({result: true}) : res.json({result: false, error: 'User not found'})
  })
})

// ROUTE CHANGE PASSWORD
router.put('/password', (req, res) => {
  User.findOne({email: req.body.email})
  .then(data => {
    if (data && bcrypt.compareSync(req.body.oldPassword, data.password)) {
      const hash = bcrypt.hashSync(req.body.newPassword, 1);
      User.updateOne({email: req.body.email}, {password: hash})
      .then(() => {
        res.json({result: true})
      })
    }
    else {
      res.json({result: false, error: 'Could not verify user'})
    }
  })
})

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:3001/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3001/dashboard');
  });

module.exports = router;
