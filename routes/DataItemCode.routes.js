var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var DataItemCodeModel = require('./../models/DataItemCodeModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create',[
    check('Category').not().isEmpty().withMessage("Not a valid Date"),
    check('Entry').not().isEmpty().withMessage("Please provide valid Entry")
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
     await DataItemCodeModel.create({

         Category:req.body.Category || "",
         Entry:req.body.Entry  || "",
         Formula:req.body.Formula || "",
         Item_Name:req.body.Item_Name  || "",
         Data_Item:req.body.Data_Item  || "",
         ItemCode : req.body.ItemCode  || "",
         Heading : req.body.Heading  || "",
         Description: req.body.Description  || "",
         Explanation: req.body.Explanation  || "",
         //User_Type:req.body.User_Type || "",
         //Unit: req.body.Unit,
         Comprises:req.body.Comprises  || "",
         Except: req.body.Except  || "",
         Financial_Start_Year:req.body.Financial_Start_Year || 0,
         Financial_End_Year:req.body.Financial_End_Year || 0,
         Value:req.body.Value || "",
         Remarks:req.body.Remarks || "",
         Entry_Date:req.body.Entry_Date,
         Savage_Status:req.body.Savage_Status || "",
         //Submitted_By_Employee:req.body.Submitted_By_Employee,
         //Authorized_By:req.body.Authorized_By,
         Request_Approval_Status:req.body.Request_Approval_Status || "",
         Authorized_Action:req.body.Authorized_Action || "",
         Authorized_Reason_for_Rejection:req.body.Authorized_Reason_for_Rejection || "",
         Admin_Approval_Status:req.body.Admin_Approval_Status || "",
         Admin_Reason_for_Rejection:req.body.Admin_Reason_for_Rejection || ""
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
        await DataItemCodeModel.find({}, function (err, DataItemCodeDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(DataItemCodeDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"DataItemCodeDetails", Data : DataItemCodeDetails ,Code:200});
        }).populate('Category Entry');
});

router.post('/edit', async function (req, res) {
        await DataItemCodeModel.findByIdAndUpdate(req.body.DataItemCode_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"DataItemCodeDetails Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.post('/innerlist', async function (req, res) {
        await DataItemCodeModel.find({_id:req.body.DataItemCode_id}, function (err, DataItemCodeDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(DataItemCodeDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"DataItemCodeDetails", Data : DataItemCodeDetails ,Code:200});
        }).populate('Category Entry Unit');
});

// // DELETES A USER FROM THE DATABASE
router.post('/delete', async function (req, res) {
      await DataItemCodeModel.findByIdAndRemove(req.body.DataItemCode_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"DataItemCode Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;