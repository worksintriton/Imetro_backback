var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var EntryModel = require('./../models/EntryModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create',[
    //check('Date').not().isEmpty().withMessage("Not a valid Date"),
    check('Entry_Name').not().isEmpty().withMessage("Please provide valid Entry_Name")
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
     await EntryModel.create({
         //Date : req.body.Date || "",
         Entry_Name : req.body.Entry_Name || "",
        },
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Entry Added successfully", Data :user ,Code:200}); 
    });      
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.get('/getlist', async function (req, res) {
        await EntryModel.find({}, function (err, EntryDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(EntryDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"EntryDetails", Data : EntryDetails ,Code:200});
        }).sort({createdAt:-1});
});

router.post('/edit', async function (req, res) {
        await EntryModel.findByIdAndUpdate(req.body.Entry_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"EntryDetails Updated successfully", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', async function (req, res) {
      await EntryModel.findByIdAndRemove(req.body.Entry_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Entry Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;