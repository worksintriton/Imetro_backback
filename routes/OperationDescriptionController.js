var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('./../models/User');
var OperationalDescription = require('./../models/OperationdataDescription');
/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
//var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file


router.post('/create',VerifyToken, function(req, res) {

        OperationalDescription.create({
          ItemCode : mongoose.Types.ObjectId(req.body.code),
          Heading : req.body.name,
          Description: req.body.description,
          Explanation: req.body.explain,
          Unit: req.body.unit,
          Comprises:req.body.comprises,
          Except: req.body.except,
        }, 
        function (err, user) {
          if (err) return res.status(500).send("There was a problem Inserting the Data`.");

          res.status(200).send("Data insertion Success");
        });

});
router.post('/getItem',VerifyToken, function (req, res) {
        var Itemcode = req.body.ItemCode;
        OperationalData.find({ItemCode:ItemCode}, function (err, Data) {
            if (err) return res.status(500).send("There was a problem finding the Data.");
            res.status(200).send(Data);
        });
});
router.put('/edit/:id',VerifyToken, function (req, res) {
        OperationalDescription.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, Data) {
            if (err) return res.status(500).send("There was a problem updating the Data.");
            res.status(200).send(Data);
        });
});

router.get('/getlist',VerifyToken, function (req, res) {
        OperationalDescription.find({}, function (err, Data) {
            if (err) return res.status(500).send("There was a problem finding the Data.");
            res.status(200).send(Data);
        });
});
router.get('/view/:id', VerifyToken, function (req, res) {
      OperationalDescription.findById(req.params.id, function (err, Data) {
          if (err) return res.status(500).send("There was a problem finding the Data.");
          if (!user) return res.status(404).send("No Data found.");
          res.status(200).send(Data);
      });
});

// DELETES A USER FROM THE DATABASE
router.delete('/delete/:id',VerifyToken, function (req, res) {
      OperationalDescription.findByIdAndRemove(req.params.id, function (err, Data) {
          if (err) return res.status(500).send("There was a problem deleting the Data.");
          res.status(200).send("Operational: "+ user.ItemCode +" was deleted.");
      });
});

module.exports = router;