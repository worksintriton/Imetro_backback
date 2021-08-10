var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var FormulaModel = require('./../models/FormulaModel');
var DataItemCodeModel = require('./../models/DataItemCodeModel');
var DataEntryModel = require('./../models/DataEntryModel');
var EmployeeModel = require('./../models/EmployeeModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');


var DataItemCodeModel = require('./../models/DataItemCodeModel');
var DataEntryModel = require('./../models/DataEntryModel');
var EmployeeModel = require('./../models/EmployeeModel');

router.post('/create', async function(req, res) {
  try{
     await FormulaModel.create({
         Item_code_id : req.body.Item_code_id || "",
         Method_type: req.body.Method_type || "",
         Itemcode_list: req.body.Itemcode_list || "",
         Code_type : req.body.Code_type || "",
         For_add_status : req.body.For_add_status || ""
        },
        function (err, user) {
        // console.log(user);
        // console.log(err);
        res.json({Status:"Success",Message:"Formula Added successfully", Data : user ,Code:200}); 
    }); 
}
catch(e){
  console.log(e);
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
}
);



router.post('/calculat_value',async function (req, res) {
      var Datasavedlist = await DataEntryModel.find({});
      // console.log(Datasavedlist);
        FormulaModel.findOne({}, function (err, StateList) {
          // console.log(StateList);
          res.json({Status:"Success",Message:"Formula", Data : Datasavedlist ,Code:200});
        }).populate('Itemcode_list Item_code_id');
});






router.post('/get_value',async function (req, res) {
    var Data_item_Details = await DataItemCodeModel.findOne({ItemCode : req.body.ItemCode});
    var Check_DataEntry_details = await DataEntryModel.findOne({DataItemCode : Data_item_Details._id,Entry_Date : req.body.Entry_Date});
    // console.log("Check_DataEntry_details",Check_DataEntry_details);
    // console.log("Data_item_Details",Data_item_Details);
    var Formula_Data_item_Details = await FormulaModel.findOne({Item_code_id : Data_item_Details._id});
    // console.log(Formula_Data_item_Details);
    var item_code_list = Formula_Data_item_Details.Itemcode_list;
    var final_value = 0;
    var values = []; 
    for(let a = 0 ; a < item_code_list.length ; a++){
      // console.log(item_code_list[a],req.body.Entry_Date);
      var DataEntry_details = await DataEntryModel.findOne({DataItemCode : item_code_list[a],Entry_Date : req.body.Entry_Date});
      // console.log("DataEntry_details",DataEntry_details);
      if(DataEntry_details ==  null){
        values.push(0);
      }else{
        values.push(+DataEntry_details.Value);
      }
      if(a == item_code_list.length - 1){
        // console.log(values);
        // console.log(Formula_Data_item_Details.Method_type);
        if(Formula_Data_item_Details.Method_type == "Addition"){
          for(let a = 0 ; a < values.length ; a ++){
            final_value = final_value + values[a];
          }
        if(Check_DataEntry_details == null){
     var employeedataitemcodes = await EmployeeModel.findOne({_id:req.body.Employee_id});
     await DataEntryModel.create({
         Financial_Year : req.body.Financial_Year || "",
         Employee_id:req.body.Employee_id || "",
         Department:req.body.Department  || "",
         Submitted_By_Employee:req.body.Employee_id,
         Authorized_To: employeedataitemcodes.Authorized_To ,
         Entry:req.body.Entry || "",
         Entry_Date:req.body.Entry_Date || "",
         DataItemCode: Data_item_Details._id || "",
         Data_Item:Data_item_Details.ItemCode  || "",
         Value : final_value  || "",
         Remarks : "Auto Calculation"  || "",
         Savage_Status: "Save" || ""
        },
        function (err, user) {
          // console.log(user)
          // console.log("Inserted");
        res.json({Status:"Success",Message:"Data Entry Details Added successfully", Data :user ,Code:200}); 
      });
        }else {
          let c = {
           Value : final_value  || "",
           Remarks : "Auto Calculation"  || "",
          }
          await DataEntryModel.findByIdAndUpdate(Check_DataEntry_details._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
           // console.log("Updated");
             res.json({Status:"Success",Message:"Updated successfully", Data : UpdatedDetails ,Code:200});
        });
        }

        }else if(Formula_Data_item_Details.Method_type == "Subtraction"){
           final_value = values[0] - values[1];
        if(Check_DataEntry_details == null){
     var employeedataitemcodes = await EmployeeModel.findOne({_id:req.body.Employee_id});
     await DataEntryModel.create({
         Financial_Year : req.body.Financial_Year || "",
         Employee_id:req.body.Employee_id || "",
         Department:req.body.Department  || "",
         Submitted_By_Employee:req.body.Employee_id,
         Authorized_To: employeedataitemcodes.Authorized_To ,
         Entry:req.body.Entry || "",
         Entry_Date:req.body.Entry_Date || "",
         DataItemCode: Data_item_Details._id || "",
         Data_Item:Data_item_Details.ItemCode  || "",
         Value : final_value  || "",
         Remarks : "Auto Calculation"  || "",
         Savage_Status: "Save" || ""
        },
        function (err, user) {
          // console.log(user)
          // console.log("Inserted");
        res.json({Status:"Success",Message:"Data Entry Details Added successfully", Data :user ,Code:200}); 
      });
        }else {
          let c = {
           Value : final_value  || "",
           Remarks : "Auto Calculation"  || "",
          }
          await DataEntryModel.findByIdAndUpdate(Check_DataEntry_details._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
           // console.log("Updated");
             res.json({Status:"Success",Message:"Updated successfully", Data : UpdatedDetails ,Code:200});
        });
        }
        }else if(Formula_Data_item_Details.Method_type == "Multiplication"){   
        final_value = values[0] * values[1];
        if(Check_DataEntry_details == null){
     var employeedataitemcodes = await EmployeeModel.findOne({_id:req.body.Employee_id});
     await DataEntryModel.create({
         Financial_Year : req.body.Financial_Year || "",
         Employee_id:req.body.Employee_id || "",
         Department:req.body.Department  || "",
         Submitted_By_Employee:req.body.Employee_id,
         Authorized_To: employeedataitemcodes.Authorized_To ,
         Entry:req.body.Entry || "",
         Entry_Date:req.body.Entry_Date || "",
         DataItemCode: Data_item_Details._id || "",
         Data_Item:Data_item_Details.ItemCode  || "",
         Value : final_value  || "",
         Remarks : "Auto Calculation"  || "",
         Savage_Status: "Save" || ""
        },
        function (err, user) {
          // console.log(user)
          // console.log("Inserted");
        res.json({Status:"Success",Message:"Data Entry Details Added successfully", Data :user ,Code:200}); 
      });
        }else {
          let c = {
           Value : final_value  || "",
           Remarks : "Auto Calculation"  || "",
          }
          await DataEntryModel.findByIdAndUpdate(Check_DataEntry_details._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
           // console.log("Updated");
             res.json({Status:"Success",Message:"Updated successfully", Data : UpdatedDetails ,Code:200});
        });
        }
        }else if(Formula_Data_item_Details.Method_type == "Division"){


           final_value = values[0] / values[1];
        if(Check_DataEntry_details == null){
     var employeedataitemcodes = await EmployeeModel.findOne({_id:req.body.Employee_id});
     await DataEntryModel.create({
         Financial_Year : req.body.Financial_Year || "",
         Employee_id:req.body.Employee_id || "",
         Department:req.body.Department  || "",
         Submitted_By_Employee:req.body.Employee_id,
         Authorized_To: employeedataitemcodes.Authorized_To ,
         Entry:req.body.Entry || "",
         Entry_Date:req.body.Entry_Date || "",
         DataItemCode: Data_item_Details._id || "",
         Data_Item:Data_item_Details.ItemCode  || "",
         Value : final_value  || "",
         Remarks : "Auto Calculation"  || "",
         Savage_Status: "Save" || ""
        },
        function (err, user) {
          // console.log(user)
          // console.log("Inserted");
        res.json({Status:"Success",Message:"Data Entry Details Added successfully", Data :user ,Code:200}); 
      });
        }else {
          let c = {
           Value : final_value  || "",
           Remarks : "Auto Calculation"  || "",
          }
          await DataEntryModel.findByIdAndUpdate(Check_DataEntry_details._id, c, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
           // console.log("Updated");
             res.json({Status:"Success",Message:"Updated successfully", Data : UpdatedDetails ,Code:200});
        });
        }

        }












      }
    }



    //  await DataEntryModel.create({
    //      Financial_Year : req.body.Financial_Year || "",
    //      Employee_id:req.body.Employee_id || "",
    //      Department:req.body.Department  || "",
    //      Submitted_By_Employee:req.body.Employee_id,
    //      Authorized_To: employeedataitemcodes.Authorized_To,
    //      Entry:req.body.Entry || "",
    //      Entry_Date:req.body.Entry_Date || "",
    //      DataItemCode:req.body.DataItemCode  || "",
    //      Data_Item:req.body.Data_Item  || "",
    //      Value : req.body.Value  || "",
    //      Remarks : req.body.Remarks  || "",
    //      Savage_Status:req.body.Savage_Status || ""
    //     },
    //     function (err, user) {
    //       console.log(user)
    //     res.json({Status:"Success",Message:"Data Entry Details Added successfully", Data :user ,Code:200}); 
    // });





      // var Datasavedlist = await DataEntryModel.find({});
      // console.log(Datasavedlist);
      //   FormulaModel.findOne({}, function (err, StateList) {
      //     // console.log(StateList);
      //     res.json({Status:"Success",Message:"Formula", Data : Datasavedlist ,Code:200});
      //   }).populate('Itemcode_list Item_code_id');
});












router.post('/auto_valuelist',async function (req, res){
	var Entry = req.body.Entry;
	var Financial_Year= req.body.Financial_Year;
	var Entry_Field = req.body.Entry_Field;
	var Total = 0;
	var ListData =await DataEntryModel.find({Employee_id:req.body.Employee_id});
	var EmployeeItemcodes = await EmployeeModel.findOne({_id:req.body.Employee_id});
	for (var i=0;i<EmployeeItemcodes.DataItemCode.length;i++) 
	{
    if(Entry=="5f5f598680eeec35cb6c5916")
    {
    	// console.log(EmployeeItemcodes.DataItemCode[i])
     var Calculationtype = await DataItemCodeModel.find({_id:EmployeeItemcodes.DataItemCode[i],Entry:Entry});
    // console.log(Calculationtype,"Calculationtype...###"); 
    }
    else if(Entry=="5f5f597c80eeec35cb6c5915" || Entry=="5f3f28828174a05db670b318" || Entry=="5f3e62340b47a54d4fedcec1" || Entry=="5f3be9dbd3ba9853ef042017")
    {
		var Calculationtype = await DataItemCodeModel.find({_id:{$in:EmployeeItemcodes.DataItemCode},Entry:Entry,Financial_Year:req.body.Financial_Year,Entry_Date:req.body.Entry_Date});
    // console.log(Calculationtype[i].Formula_type,"Calculationtype...###"); 
    
    }
	if(Calculationtype[i].Formula_type=="Auto Calculations"){
	var Formulatype = await FormulaModel.findOne({Item_code_id:Calculationtype[i]}).select('Method_type');	
	}
			// var Itemcode_list =await FormulaModel.findOne({Item_code_id:Calculationtype[i]}).select('Itemcode_list');
			// console.log(Itemcode_list,"Formulatype---- #####")
	if(Formulatype.Method_type=="Addition")
      {
      var Itemcode_list =await FormulaModel.findOne({Item_code_id:Calculationtype[i]._id});
			// console.log(Itemcode_list,"Formulatype---- #####")

       for(var j=0;j<Itemcode_list.Itemcode_list.length;j++)
         {
          // console.log("DataItemCode.....",Itemcode_list.Itemcode_list[j]);
           var Itemcode_listData = await DataEntryModel.findOne({DataItemCode:Itemcode_list.Itemcode_list[j]});
           // console.log(Itemcode_listData,"value of the DataItemCode");
            Total += parseInt(Itemcode_listData.Value);
           }
           var finalcheck= await DataEntryModel.findOne({DataItemCode:Calculationtype[i]._id});
           var datajson = {
          "DataItemCode":Calculationtype[i]._id,
          "Employee_id":req.body.Employee_id,
          "Entry":Entry_Field,
          "Value":Total,
          "Remarks": "",
          "Entry":req.body.Entry,
          "Entry_Date":req.body.Entry_Date || "",
          "Financial_Year":req.body.Financial_Year
         };
           if(finalcheck==null){
         var createData = await DataEntryModel.create(datajson);
         var ListData1 =await DataEntryModel.find({Employee_id:req.body.Employee_id,Entry:req.body.Entry});
         res.json({Status:"Success",Message:"Formula", Data : ListData1 ,Code:200});
          }
          else{
          var ListData1 =await DataEntryModel.findOneAndUpdate({Employee_id:req.body.Employee_id,DataItemCode:Calculationtype[i]._id},datajson, { upsert: true, new: true });
          res.json({Status:"Success",Message:"Formula", Data : ListData1 ,Code:200});
         }                
      }
    if(Formulatype.Method_type=="Subtraction"&& Calculationtype[i].Formula_type=="Auto Calculations")
      {
      var Itemcode_list =await FormulaModel.findOne({Item_code_id:Calculationtype[i]._id});
      var Itemcode_listData = await DataEntryModel.find({DataItemCode:{$in:Itemcode_list.Itemcode_list}});
      // console.log(Itemcode_list,"Formulatype---- #####")
        var First_Value = parseInt(Itemcode_listData[0].Value);
        var Second_Value = parseInt(Itemcode_listData[1].Value);
        Total = Math.abs(First_Value - Second_Value);
           var finalcheck= await DataEntryModel.findOne({DataItemCode:Calculationtype[i]._id});
            var datajson = {
          "DataItemCode":Calculationtype[i]._id,
          "Employee_id":req.body.Employee_id,
          "Entry":Entry_Field,
          "Value":Total,
          "Remarks": "",
          "Entry":req.body.Entry,
          "Entry_Date":req.body.Entry_Date || "",
          "Financial_Year":req.body.Financial_Year
         };
           if(finalcheck==null){
         var createData = await DataEntryModel.create(datajson);
         var ListData1 =await DataEntryModel.find({Employee_id:req.body.Employee_id,Entry:req.body.Entry});
         res.json({Status:"Success",Message:"Formula", Data : ListData1 ,Code:200});
          }
          else{
          var ListData1 =await DataEntryModel.findOneAndUpdate({Employee_id:req.body.Employee_id,DataItemCode:Calculationtype[i]._id},datajson, { upsert: true, new: true });
          res.json({Status:"Success",Message:"Formula", Data : ListData1 ,Code:200});
         
           }
                  
    }
          if(Formulatype.Method_type=="Division"&& Calculationtype[i].Formula_type=="Auto Calculations")
      {
      var Itemcode_list =await FormulaModel.findOne({Item_code_id:Calculationtype[i]._id});
      var Itemcode_listData = await DataEntryModel.find({DataItemCode:{$in:Itemcode_list.Itemcode_list}});
      // console.log(Itemcode_list,"Formulatype---- #####")
        var First_Value = parseInt(Itemcode_listData[0].Value);
        var Second_Value = parseInt(Itemcode_listData[1].Value);
        Total = Math.abs(First_Value/Second_Value);
           var finalcheck= await DataEntryModel.findOne({DataItemCode:Calculationtype[i]._id});
            var datajson = {
          "DataItemCode":Calculationtype[i]._id,
          "Employee_id":req.body.Employee_id,
          "Entry":Entry_Field,
          "Value":Total,
          "Remarks": "",
          "Entry":req.body.Entry,
          "Entry_Date":req.body.Entry_Date || "",
          "Financial_Year":req.body.Financial_Year
         };
           if(finalcheck==null){
         var createData = await DataEntryModel.create(datajson);
         var ListData1 =await DataEntryModel.find({Employee_id:req.body.Employee_id,Entry:req.body.Entry});
         res.json({Status:"Success",Message:"Formula", Data : ListData1 ,Code:200});
          }
          else{
          var ListData1 =await DataEntryModel.findOneAndUpdate({Employee_id:req.body.Employee_id,DataItemCode:Calculationtype[i]._id},datajson, { upsert: true, new: true });
          res.json({Status:"Success",Message:"Formula", Data : ListData1 ,Code:200});
         
           }
                  
      } 
  if(Formulatype.Method_type=="Multiplication"&& Calculationtype[i].Formula_type=="Auto Calculations")
      {
      var Itemcode_list =await FormulaModel.findOne({Item_code_id:Calculationtype[i]._id});
      var Itemcode_listData = await DataEntryModel.find({DataItemCode:{$in:Itemcode_list.Itemcode_list}});
      // console.log(Itemcode_list,"Formulatype---- #####")
        var First_Value = parseInt(Itemcode_listData[0].Value);
        var Second_Value = parseInt(Itemcode_listData[1].Value);
        Total = (First_Value * Second_Value);
           var finalcheck= await DataEntryModel.findOne({DataItemCode:Calculationtype[i]._id});
            var datajson = {
          "DataItemCode":Calculationtype[i]._id,
          "Employee_id":req.body.Employee_id,
          "Entry":Entry_Field,
          "Value":Total,
          "Remarks": "",
          "Entry":req.body.Entry,
          "Entry_Date":req.body.Entry_Date || "",
          "Financial_Year":req.body.Financial_Year
         };
           if(finalcheck==null){
         var createData = await DataEntryModel.create(datajson);
         var ListData1 =await DataEntryModel.find({Employee_id:req.body.Employee_id,Entry:req.body.Entry});
         res.json({Status:"Success",Message:"Formula", Data : ListData1 ,Code:200});
          }
          else{
          var ListData1 =await DataEntryModel.findOneAndUpdate({Employee_id:req.body.Employee_id,DataItemCode:Calculationtype[i]._id},datajson, { upsert: true, new: true });
          res.json({Status:"Success",Message:"Formula", Data : ListData1 ,Code:200});
         
           }
                  
      } 
          

  }

});

router.get('/getlist', async function (req, res) {
        await FormulaModel.find({}, function (err, CategoryDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(CategoryDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Formula", Data : CategoryDetails ,Code:200});
        }).populate('Item_code_id Itemcode_list');
});


router.get('/getlist_fnyr', async function (req, res) {
          let start_yr =  1971;
          let end_yr = 2050
          let years = [];
        for(let a = start_yr ; a < end_yr ; a ++){
          let x = a+2;
          let y = a+1 +" - "+ x;
          years.push(y);
          if(a == end_yr - 1){
            res.json({Status:"Success",Message:"Formula", Data : years ,Code:200});    
          }
        }
});




router.get('/deletes', function (req, res) {
      FormulaModel.remove({}, function (err, user) {
      if (err) return res.status(500).send("There was a problem deleting the user.");
      res.json({Status:"Success",Message:"Formula Deleted all", Data : {} ,Code:200});     
      });
});


router.post('/getlist_id', function (req, res) {
        FormulaModel.findOne({Item_code_id:req.body._id}, function (err, StateList) {
          res.json({Status:"Success",Message:"Formula data Details", Data : StateList ,Code:200});
        }).populate('Itemcode_list Item_code_id');
});


router.get('/getlist_dropdown', async function (req, res) {
        await FormulaModel.find({status:'false'}, function (err, CategoryDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(CategoryDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Formula", Data : CategoryDetails ,Code:200});
        }).sort({createdAt:-1});
});


router.post('/edit', async function (req, res) {
  // console.log(req.body);
        await FormulaModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"Updated successfully", Data : UpdatedDetails ,Code:200});
        });
});


// // DELETES A USER FROM THE DATABASE
router.post('/delete', async function (req, res) {
      await FormulaModel.findByIdAndRemove(req.body.Category_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Formula Deleted successfully", Data : {} ,Code:200});
      });
});



	
module.exports = router;