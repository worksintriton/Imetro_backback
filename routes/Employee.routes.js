var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var EmployeeModel = require('./../models/EmployeeModel');
var PermissionModel = require('./../models/PermissionModel');
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

        },
       async function (err, user) {
          console.log(user)
          if(user!==null){
            let permissioData = {
              Employee_id: user._id,
              View:req.body.View || "",
              Edit: req.body.Edit || "",
              Add:req.body.Add ||"",
              Apporval:req.body.Apporval || ""

            }
            var RoleManagment = await PermissionModel.create(permissioData);
            var Roleupdate = await EmployeeModel.findByIdAndUpdate(user_id,{Role:RoleManagment._id},{new:true});
          }
          else{
              res.json({Status:"Failed",Message:"Issue in the permission Allocation", Data : {},Code:300});
          }
        res.json({Status:"Success",Message:"Added successfully", Data :user ,Code:200}); 
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
        });
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
      await EmployeeModel.findByIdAndRemove(req.body.EmployeeModel_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"DataItemCode Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;