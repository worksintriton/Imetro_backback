var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var DepartmentModel = require('./../models/DepartmentModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create',[
    //check('Date').not().isEmpty().withMessage("Not a valid Date"),
    check('Department_Name').not().isEmpty().withMessage("Please provide valid Department_Name")
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
     await DepartmentModel.create({
         //Date : req.body.Date || "",
         Department_Name : req.body.Department_Name || "",
        },
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Department Added successfully", Data :user ,Code:200}); 
    });      
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.get('/getlist', async function (req, res) {
        await DepartmentModel.find({}, function (err, DepartmentDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(DepartmentDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Department Details", Data : DepartmentDetails ,Code:200});
        }).sort({createdAt:-1});
});

router.post('/edit', async function (req, res) {
        await DepartmentModel.findByIdAndUpdate(req.body.Department_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"Department Details Updated Successfully", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', async function (req, res) {
      await DepartmentModel.findByIdAndRemove(req.body.Department_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Department Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;