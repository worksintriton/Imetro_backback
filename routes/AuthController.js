var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('./../models/User');
/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
//var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file

router.post('/login', function(req, res) {

      User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        
        // check if the password is valid
        var passwordIsValid = req.body.password;
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        // if user is found and password is valid
        // create a token
        var token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });

        // return the information including token as JSON
        res.status(200).send({ auth: true, token: token });
      });

});

router.post('/register', function(req, res) {

        User.create({
          name : req.body.name,
          email : req.body.email,
          password : req.body.password,
          phone : req.body.phone,
        }, 
        function (err, user) {
          if (err) return res.status(500).send("There was a problem registering the user`.");

          // if user is registered without errors
          // create a token
          var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
          });

          res.status(200).send({ auth: true, token: token });
        });

});


router.post('/forgotpassword', async function(req, res) {

       var email = req.body.email;
         console.log(email);
       var passworddata = await User.find({email:email}).select('password');
       console.log("passworddata",passworddata[0].password)
         var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'anjani513devi@gmail.com',
            pass: 'anjanichotu4507'
          }
        });

        var mailOptions = {
        //from: 'anjani513devi@gmail.com',
          to: email,
          subject: 'Paaword Mail!!!',
          text: "Your current password is " + passworddata[0].password
      };

      transporter.sendMail(mailOptions, function(error, info){
          if (error) {
          console.log("erorr related the mail ", error);
          } else {
          console.log('Email sent: ' + info.response);
          }
        });
        res.status(200).send("password has been sent to your email!!!");
       
        });

router.put('/edit/:id',VerifyToken, function (req, res) {
        User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.status(200).send(user);
        });
});

router.get('/getlist',VerifyToken, function (req, res) {
        User.find({}, function (err, users) {
            if (err) return res.status(500).send("There was a problem finding the users.");
            res.status(200).send(users);
        });
});
router.get('/view/:id', VerifyToken, function (req, res) {
      User.findById(req.params.id, function (err, user) {
          if (err) return res.status(500).send("There was a problem finding the user.");
          if (!user) return res.status(404).send("No user found.");
          res.status(200).send(user);
      });
});

// DELETES A USER FROM THE DATABASE
router.delete('/delete/:id',VerifyToken, function (req, res) {
      User.findByIdAndRemove(req.params.id, function (err, user) {
          if (err) return res.status(500).send("There was a problem deleting the user.");
          res.status(200).send("User: "+ user.name +" was deleted.");
      });
});

module.exports = router;