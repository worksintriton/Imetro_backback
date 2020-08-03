var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var UnitModel = require('./../models/UnitModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create',[
    //check('Date').not().isEmpty().withMessage("Not a valid Date"),
    check('Unit_Name').not().isEmpty().withMessage("Please provide valid Unit_Name")
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
     await UnitModel.create({
         //Date : req.body.Date || "",
         Unit_Name : req.body.Unit_Name || "",
        },
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data :user ,Code:200}); 
    });      
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.get('/getlist', async function (req, res) {
        await UnitModel.find({}, function (err, UnitDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(UnitDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"UnitDetails", Data : UnitDetails ,Code:200});
        });
});

router.post('/edit', async function (req, res) {
        await UnitModel.findByIdAndUpdate(req.body.Unit_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"UnitDetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', async function (req, res) {
      await UnitModel.findByIdAndRemove(req.body.Unit_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Unit Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;