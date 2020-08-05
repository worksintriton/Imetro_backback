var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var EntryModel = require('./../models/EntryModel');
var DataItemCodeModel = require('./../models/DataItemCodeModel');
var EmployeeModel = require('./../models/EmployeeModel');
var DepartmentModel = require('./../models/DepartmentModel');
var CatagoriesModel = require('./../models/CatagoriesModel');
var DataEntryModel = require('./../models/DataEntryModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');


router.get('/entrylist', async function (req, res) {
        await EntryModel.find({}, function (err, EntryDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(EntryDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"EntryDetails", Data : EntryDetails ,Code:200});
        }).sort({createdAt:-1});
});

router.post('/itemcodelist', async function (req, res) { 

  var dataitememployeelist = await EmployeeModel.findOne({_id:req.body.Employee_id}).select('DataItemCode');
        await DataItemCodeModel.find({_id:{ $in: dataitememployeelist.DataItemCode}},{Entry :{ $elemMatch: req.body.Entry }}, function (err, EntryDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(EntryDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
           else{
            res.json({Status:"Success",Message:"Code details", Data : EntryDetails ,Code:200});
           }
        }).sort({createdAt:-1});
});

router.post('/dataentry',[
    //check('Date').not().isEmpty().withMessage("Not a valid Date"),
    //check('Remarks').not().isEmpty().withMessage("Please provide valid Remarks")
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
var Inputdata = req.body.DataentryData;

var check = Inputdata[0].Savage_Status;
//console.log(req.body.Inputdata.DataItemCode);
if(check === "Save"){
  var InsertMany = await DataEntryModel.insertMany(Inputdata);
   res.json({Status:"Success",Message:"Data Added successfully", Data :InsertMany ,Code:200});  
}
else{
  let DataItemCodeinput = [];
  for(var i=0;i<Inputdata.length;i++){
    DataItemCodeinput.push(Inputdata[i].DataItemCode);
  }
  console.log("list...", DataItemCodeinput);
  var DataItemcodeupdate = await DataEntryModel.updateMany({DataItemCode:{$in :DataItemCodeinput}}, {$set:{Savage_Status: "Finalize"}}, {multi: true});
  var finaloutput = await DataEntryModel.find({DataItemCode:{$in :DataItemCodeinput}});
  res.json({Status:"Success",Message:"Data Finalized successfully", Data :finaloutput ,Code:200}); 
}
        
}
catch(e){
  console.log(e)
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.post('/submittedcodelist', async function (req, res) {
  try{
    let EntryDetails = await DataEntryModel.find({Employee_id:req.body.Employee_id}).populate({path: 'DataItemCode', populate: { path: 'Entry'}});
    res.json({Status:"Success",Message:"EntryDetails", Data : EntryDetails ,Code:200});
  }
  catch(e){
    console.log(e)
     return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
  }
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