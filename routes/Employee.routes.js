var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var EmployeeModel = require('./../models/EmployeeModel');
var DataItemCodeModel = require('./../models/DataItemCodeModel');
//var PermissionModel = require('./../models/PermissionModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create',[
    check('Department').not().isEmpty().withMessage("Not a valid Department"),
    check('DataItemCode').not().isEmpty().withMessage("Please provide valid DataItemCode")
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
     await EmployeeModel.create({

         Department:req.body.Department || "",
         DataItemCode:req.body.DataItemCode  || "",
         Employee_Name:req.body.Employee_Name || "",
         Password:req.body.Password  || "",
         Emp_ID:req.body.Emp_ID  || "",
         Phone : req.body.Phone  || "",
         Email_Id : req.body.Email_Id  || "",
         Role: req.body.Role  || "",
         User_Type:req.body.User_Type || ""
        },
       async function (err, user) {
          console.log(user)
          if(user!==null){
            if(req.body.User_Type === "User")
            {
            var DataItemcodeupdate = await DataItemCodeModel.update({_id:{$in:req.body.DataItemCode}},{ $set:{User_code_Assigned_Status: true}},{multi: true});
            console.log(DataItemcodeupdate)
            res.json({Status:"Success",Message:"Added successfully", Data :user ,Code:200}); 
            
            }
            else{
              var DataItemcodeupdate = await DataItemCodeModel.update({_id: {$in :req.body.DataItemCode}}, {$set:{Authorized_code_Assigned_Status: true}}, {multi: true});
              res.json({Status:"Success",Message:"Added successfully", Data :user ,Code:200}); 
              console.log(DataItemcodeupdate)
            }
          }
          else{
              res.json({Status:"Failed",Message:"Issue with the itemcode updation", Data : {},Code:300});
          }
        
    });      
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.get('/getlist', async function (req, res) {
        await EmployeeModel.find({}, function (err, EmployeeDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(EmployeeDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"EmployeeDetails", Data : EmployeeDetails ,Code:200});
        }).populate('DataItemCode Department');
});

router.post('/usertypecatlist', async function (req, res) {
  if(req.body.User_Type === "User"){
    var DataItemlist = await DataItemCodeModel.find({Category:req.body.Category},{Authorized_code_Assigned_Status:false});
     res.json({Status:"Success",Message:"EmployeeDetails", Data : DataItemlist ,Code:200});
  }
  else{
     var DataItemlist = await DataItemCodeModel.find({Category:req.body.Category,User_code_Assigned_Status:false});
      res.json({Status:"Success",Message:"EmployeeDetails", Data : DataItemlist ,Code:200});
  }
});

router.post('/usertypelist', async function (req, res) {
  if(req.body.User_Type === "User"){
     var DataItemlist = await DataItemCodeModel.find({User_code_Assigned_Status:false});
     res.json({Status:"Success",Message:"EmployeeDetails", Data : DataItemlist ,Code:200});
  }
  else{
     var DataItemlist = await DataItemCodeModel.find({Authorized_code_Assigned_Status:false});
      res.json({Status:"Success",Message:"EmployeeDetails", Data : DataItemlist ,Code:200});
  }
});

router.post('/edit', async function (req, res) {
        await EmployeeModel.findByIdAndUpdate(req.body.Employee_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"EmployeeDetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', async function (req, res) {
      await EmployeeModel.findByIdAndRemove(req.body.Employee_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Employee Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;