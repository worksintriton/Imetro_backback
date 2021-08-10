var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var DataItemCodeModel = require('./../models/GroupdataitemcodeModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create',[
    // check('Category').not().isEmpty().withMessage("Not a valid Date"),
    check('Entry').not().isEmpty().withMessage("Please provide valid Entry")
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
     var Report_SNo = await DataItemCodeModel.findOne({Report_SNo : req.body.Report_SNo});
     console.log(Report_SNo);
     if(Report_SNo !== null){
        return res.json({Status:"Failed",Message: "Entered Report S.No is already Used", Data :{},Code:422});
     }else{
     await DataItemCodeModel.create({
         Category:req.body.Category || "",
         Entry:req.body.Entry  || "",
         Report_SNo:req.body.Report_SNo || 0,
         Formula:req.body.Formula || "",
         Item_Name:req.body.Item_Name  || "",
         Data_Item:req.body.Data_Item  || "",
         ItemCode : req.body.ItemCode  || "",
         Heading : req.body.Heading  || "",
         Unit_Name:req.body.Unit_Name || "",
         Description: req.body.Description  || "",
         Explanation: req.body.Explanation  || "",
         Formula_type: req.body.Formula_type || "",
         //User_Type:req.body.User_Type || "",
         //Unit: req.body.Unit,
         Comprises:req.body.Comprises  || "",
         Except: req.body.Except  || "",
         Financial_Start_Year:req.body.Financial_Start_Year || 0,
         Financial_End_Year:req.body.Financial_End_Year || 0,
        },
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Data Item Code Added successfully", Data :user ,Code:200}); 
    });   
}
}
catch(e){
  console.log(e);
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.get('/getlist', async function (req, res) {
        await DataItemCodeModel.find({}, function (err, DataItemCodeDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(DataItemCodeDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [],Code:404});
           }
           console.log(DataItemCodeDetails);
          res.json({Status:"Success",Message:"DataItemCodeDetails", Data : DataItemCodeDetails ,Code:200});
        }).populate('Entry').sort({"Report_SNo":1});
});




router.post('/Entry_getlist', async function (req, res) {
        await DataItemCodeModel.find({Entry:req.body.Entry}, function (err, DataItemCodeDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(DataItemCodeDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
           console.log(DataItemCodeDetails);
          res.json({Status:"Success",Message:"DataItemCodeDetails", Data : DataItemCodeDetails ,Code:200});
        }).populate('Category Entry').sort({"Report_SNo":1});
});




router.post('/edit', async function (req, res) {
        await DataItemCodeModel.findByIdAndUpdate(req.body.DataItemCode_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"Data Item Code Details Updated Successfully", Data : UpdatedDetails ,Code:200});
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
          res.json({Status:"Success",Message:"Data Item Code Deleted successfully", Data : {} ,Code:200});
      });
});



router.get('/deletes', function (req, res) {
      DataItemCodeModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"DataItemCodeModel datas Deleted successfully", Data : {} ,Code:200});
      });
});





module.exports = router;