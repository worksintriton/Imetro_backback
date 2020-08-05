var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var CatagoriesModel = require('./../models/CatagoriesModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create',[
    //check('Date').not().isEmpty().withMessage("Not a valid Date"),
    check('Category_Name').not().isEmpty().withMessage("Please provide valid Category_Name")
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
     await CatagoriesModel.create({
         //Date : req.body.Date || "",
         Category_Name : req.body.Category_Name || "",
        },
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Category Added successfully", Data : user ,Code:200}); 
    });      
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.get('/getlist', async function (req, res) {
        await CatagoriesModel.find({}, function (err, CategoryDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(CategoryDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"CategoryDetails", Data : CategoryDetails ,Code:200});
        });
});

router.post('/edit', async function (req, res) {
        await CatagoriesModel.findByIdAndUpdate(req.body.Category_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"CategoryDetails Updated successfully", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', async function (req, res) {
      await CatagoriesModel.findByIdAndRemove(req.body.Category_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Category Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;