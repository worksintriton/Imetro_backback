var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var EntryModel = require('./../models/EntryModel');
var DataItemCodeModel = require('./../models/GroupdataitemcodeModel');
var EmployeeModel = require('./../models/GroupuserdetailModel');
var DataEntryModel = require('./../models/GroupDataEntryModel');




var DepartmentModel = require('./../models/DepartmentModel');
var CatagoriesModel = require('./../models/CatagoriesModel');
// var DataEntryModel = require('./../models/DataEntryModel');
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

router.post('/dataitemcodelist', async function (req, res) {
        await DataEntryModel.find({Employee_id:req.body.Employee_id,Entry:req.body.Entry}, function (err, EntryDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data:{},Code:500});
           if(EntryDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data :{},Code:404});
           }
          res.json({Status:"Success",Message:"EntryDetails", Data : EntryDetails ,Code:200});
        }).sort({createdAt:-1});
});



router.post('/itemcodelist', async function (req, res) {
  var employeeitemcodes = await EmployeeModel.find({User_id:req.body.Employee_id}).populate('Item_code_id Department_id');
  //var EnteredData =  DataEntryModel.find({Employee_id:req.body.Employee_id,Entry:req.body.Entry});
  let temp = [];
  employeeitemcodes.forEach(element => 
    temp.push(element.Item_code_id)
    // console.log(element)
    );
  // console.log(employeeitemcodes.DataItemCode);

        await DataItemCodeModel.find({_id:{$in:temp},Entry:req.body.Entry}, async function (err, EntryDetails) {
          // console.log(EntryDetails);
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(EntryDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
           let convert_data = [];
           for (var k = 0; k< EntryDetails.length;k++) {
             let a = {
         _id : EntryDetails[k]._id,
         Category:  EntryDetails[k].Category,
         Entry:EntryDetails[k].Entry,
         Formula:EntryDetails[k].Formula,
         Item_Name:EntryDetails[k].Item_Name,
         Data_Item: EntryDetails[k].Data_Item,
         ItemCode : EntryDetails[k].ItemCode,
         Heading :EntryDetails[k].Heading,
         Unit_Name:EntryDetails[k].Unit_Name,
         Description: EntryDetails[k].Description,
         Explanation: EntryDetails[k].Explanation,
         Comprises:EntryDetails[k].Comprises,
         Except: EntryDetails[k].Except,
         Financial_Start_Year:EntryDetails[k].Financial_Start_Year,
         Financial_End_Year:EntryDetails[k].Financial_End_Year,
         Formula_type : EntryDetails[k].Formula_type,
        ///Additional params///
        Item_code_save_status : "",
        //Item_code_save_finalize : false,
        Item_code_value: "",
        Item_code_remark : "",
        Report_SNo : EntryDetails[k].Report_SNo
             }
             convert_data.push(a);
             if(k == EntryDetails.length - 1){
           var Datasavedlist = await DataEntryModel.find({Employee_id:req.body.Employee_id,Entry_Date:req.body.Entry_Date,Financial_Year:req.body.Financial_Year}).populate('DataItemCode');
          console.log(Datasavedlist)
           // var Datasavedlist = await DataEntryModel.find({Employee_id:req.body.Employee_id,Entry_Date:req.body.Entry_Date,Financial_Year:req.body.Financial_Year});
           for(var i=0; i< convert_data.length;i++){
            for(var j=0; j < Datasavedlist.length; j++){
              if(""+convert_data[i]._id == ""+Datasavedlist[j].DataItemCode._id){
                   convert_data[i].Item_code_save_status = Datasavedlist[j].Savage_Status;
                   // convert_data[i].Item_code_save_finalize = true;
                   convert_data[i].Item_code_value = Datasavedlist[j].Value;
                   convert_data[i].Item_code_remark = Datasavedlist[j].Remarks;
              }
            }
            if(i == convert_data.length - 1){
                convert_data.sort(function(a, b) {
    return parseFloat(a.Report_SNo) - parseFloat(b.Report_SNo);
     });
              res.json({Status:"Success",Message:"EntryDetails", Data : convert_data ,Code:200});
            }
           }
             }
           }
        }).sort({createdAt:-1}).populate('Entry');
});

router.post('/dataentry',[
    //check('Date').not().isEmpty().withMessage("Not a valid Date"),
    //check('Remarks').not().isEmpty().withMessage("Please provide valid Remarks")
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
var Inputdata = req.body.DataentryData;
var check = Inputdata[0].Savage_Status;
var EntryDate = Inputdata[0].Entry_Date;
var Entrytype = Inputdata[0].Entry;
var Employee_ids = Inputdata[0].Employee_id;
let DataItemCodeinput = [];
  for(var i=0;i<Inputdata.length;i++){
    DataItemCodeinput.push(Inputdata[i].DataItemCode);
  }
if(check === "Save"){
  var EmployeeEntryDate = await DataEntryModel.find({Employee_id:Employee_ids,Entry_Date:EntryDate,Entry:Entrytype,DataItemCode:{$in:DataItemCodeinput}});
  if(EmployeeEntryDate == ""){
     var InsertMany = await DataEntryModel.insertMany(Inputdata);
   res.json({Status:"Success",Message:"Data Added successfully", Data :InsertMany ,Code:200});   
  }
else{
  for(var i=0;i< Inputdata.length; i++)
  var DataItemcodeupdate = await DataEntryModel.updateMany({Employee_id:Inputdata[i].Employee_id,DataItemCode:DataItemCodeinput[i]}, {$set:{Value:Inputdata[i].Value,Remarks:Inputdata[i].Remarks}}, {multi: true});
    res.json({Status:"Success",Message:"Data Saved successfully", Data :{} ,Code:200});  
}
}
else{
  var DataItemcodeupdate = await DataEntryModel.updateMany({Employee_id:Employee_ids,DataItemCode:{$in :DataItemCodeinput}}, {$set:{Savage_Status: "Finalize"}}, {multi: true});
  var finaloutput = await DataEntryModel.find({DataItemCode:{$in :DataItemCodeinput}});
  res.json({Status:"Success",Message:"Data Saved successfully", Data :finaloutput ,Code:200}); 
}       
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.post('/dataentry1',[
    //check('Category').not().isEmpty().withMessage("Not a valid Date"),
    //check('Entry').not().isEmpty().withMessage("Please provide valid Entry")
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
   
    var employeedataitemcodes = await EmployeeModel.findOne({User_id:req.body.Employee_id}).populate('User_id');
    console.log(employeedataitemcodes.User_id.Authorized_To);
    var SavedData = await DataEntryModel.findOne({Employee_id:req.body.Employee_id,DataItemCode:req.body.DataItemCode,Entry:req.body.Entry,Entry_Date:req.body.Entry_Date,Financial_Year:req.body.Financial_Year});
      
      console.log(
        req.body.Financial_Year,
        req.body.Employee_id,
        req.body.Department,
        req.body.Employee_id,
        employeedataitemcodes.User_id.Authorized_To,
        req.body.Entry,
        req.body.Entry_Date,
        req.body.DataItemCode,
        req.body.Data_Item,
        req.body.Value,
        req.body.Remarks,
        req.body.Savage_Status
        )

     if(SavedData == null){
        await DataEntryModel.create({
         Financial_Year : req.body.Financial_Year || "",
         Employee_id:req.body.Employee_id || "",
         Department:req.body.Department  || "",
         Submitted_By_Employee:req.body.Employee_id,
         Authorized_To: employeedataitemcodes.User_id.Authorized_To,
         Entry:req.body.Entry || "",
         Entry_Date:req.body.Entry_Date || "",
         DataItemCode:req.body.DataItemCode  || "",
         Data_Item:"",
         Value : req.body.Value  || "",
         Remarks : req.body.Remarks  || "",
         Savage_Status:req.body.Savage_Status || ""
        },
        function (err, user) {
          console.log(user);
          console.log(err);
        res.json({Status:"Success",Message:"Data Entry Details Added successfully", Data :user ,Code:200}); 
    });
     }
     else{
var updateData = await DataEntryModel.findOneAndUpdate({Employee_id:req.body.Employee_id,DataItemCode:req.body.DataItemCode,Entry:req.body.Entry,Entry_Date:req.body.Entry_Date,Financial_Year:req.body.Financial_Year},{Remarks:req.body.Remarks,Value:req.body.Value},{new:true})
      res.json({Status:"Success",Message:"Data Entry Updated Added successfully", Data :updateData ,Code:200});
     }         
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});



router.post('/finalizedata', async function (req, res) {
  try{
   if(req.body.Entry_Type == "Normal")   {
     if(req.body.Savage_Status == "Finalize"){
      var finddata = await DataEntryModel.find({Employee_id:req.body.Employee_id,Entry:req.body.Entry,Entry_Date:req.body.Entry_Date,DataItemCode:req.body.DataItemCode,Financial_Year:req.body.Financial_Year})
      var updateData1 = await DataEntryModel.findOneAndUpdate({Employee_id:req.body.Employee_id,DataItemCode:req.body.DataItemCode,Entry:req.body.Entry,Entry_Date:req.body.Entry_Date,Financial_Year:req.body.Financial_Year},{Remarks:req.body.Remarks,Value:req.body.Value,Savage_Status: "Finalize",user_Submitted_Date : req.body.user_Submitted_Date},{new:true});
      res.json({Status:"Success",Message:"Data Entry Updated Added successfully", Data :finddata ,Code:200});
     }
     else{
     	 res.json({Status:"Success",Message:"Please save before finalize", Data :updateData1 ,Code:200});
     }
   }else{
     if(req.body.Savage_Status == "Finalize"){
      var finddata = await DataEntryModel.find({Employee_id:req.body.Employee_id,Entry:req.body.Entry,Entry_Date:req.body.Entry_Date,DataItemCode:req.body.DataItemCode,Financial_Year:req.body.Financial_Year})
      var updateData1 = await DataEntryModel.findOneAndUpdate({Employee_id:req.body.Employee_id,DataItemCode:req.body.DataItemCode,Entry:req.body.Entry,Entry_Date:req.body.Entry_Date,Financial_Year:req.body.Financial_Year},{Remarks:req.body.Remarks,Value:req.body.Value,Savage_Status: "Finalize",Admin_Request_Status : "",Authorized_Action:"",Request_Approval_Status:"",user_Submitted_Date : req.body.user_Submitted_Date},{new:true});
      res.json({Status:"Success",Message:"Data Entry Updated Added successfully", Data :finddata ,Code:200});
     }
     else{
       res.json({Status:"Success",Message:"Please save before finalize", Data :updateData1 ,Code:200});
     }
   }
  }
  catch(e){
     return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
  }
});




router.post('/authfinalizedata', async function (req, res) {
  try{
     if(req.body.Status == "Finalize"){
      // console.log(req.body.Savage_Status);
      var finaldata = await DataEntryModel.findByIdAndUpdate({_id:req.body.DataEntry_id},{Admin_Request_Status:req.body.Admin_Request_Status,Admin_Reason_for_Rejection:req.body.Admin_Reason_for_Rejection,admin_Submitted_Date:req.body.admin_Submitted_Date})
      res.json({Status:"Success",Message:"Data Entry Updated Added successfully", Data :finaldata ,Code:200});
     }
     else{
       res.json({Status:"Success",Message:"Please select before finalize", Data :finaldata ,Code:200});
     }
  }
  catch(e){
     return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
  }
});




router.post('/get_authfinalizedata', async function (req, res) {
  try{
      var finaldata = await DataEntryModel.find({Financial_Year:req.body.Financial_Year}).populate('DataItemCode Entry Authorized_To Submitted_By_Employee Department').sort({"updatedAt":-1});
    finaldata.sort(function(a, b) {
    return parseFloat(a.DataItemCode.Report_SNo) - parseFloat(b.DataItemCode.Report_SNo);
     });
      res.json({Status:"Success",Message:"Data Entry Updated Added successfully", Data :finaldata ,Code:200});
   }
  catch(e){
     return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
  }
});


/////Testing////////
router.post('/get_authfinalizedata1', async function (req, res) {
  try{
  	   Entry_freq = [];
  	   Date_Filter = [];
  	   item_code_fiter = [];
  	   Department_filter = [];
  	   final_Data = [];
       if(req.body.Entry_type == "All"){
       	  Entry_freq = await DataEntryModel.find({Financial_Year:req.body.Financial_Year}).populate('DataItemCode Entry Authorized_To Submitted_By_Employee Department').sort({"updatedAt":-1});
       }else{
       	  Entry_freq = await DataEntryModel.find({Entry:req.body.Entry_type,Financial_Year:req.body.Financial_Year}).populate('DataItemCode Entry Authorized_To Submitted_By_Employee Department').sort({"updatedAt":-1});
       }
       if(req.body.From_date == "All" && req.body.To_date == "All"){
           Date_Filter = Entry_freq;
       }else{
                 for(let a = 0 ; a < Entry_freq.length ; a++){
                     var start_date = new Date(req.body.From_date);
                     var end_date =  new Date(req.body.To_date);
                     var entered_date =  new Date(Entry_freq[a].Entry_Date);
                      if(entered_date <= end_date && entered_date >= start_date){
                        Date_Filter.push(Entry_freq[a]);
                      }
                 }
       }
       if(req.body.Item_code == "All"){
           item_code_fiter = Date_Filter;
       }else{
             for(let a = 0 ; a < Date_Filter.length ; a ++){
                if(Date_Filter[a].DataItemCode.ItemCode == req.body.Item_code){
                	item_code_fiter.push(Date_Filter[a]);
                } 
             }
       }if(req.body.Department == "All"){
               Department_filter = item_code_fiter;
               final_Data = Department_filter;
       }else{
            for(let a = 0 ; a < item_code_fiter.length ; a ++){
                if(item_code_fiter[a].Department.Department_Name == req.body.Department){
                	final_Data.push(item_code_fiter[a]);
                } 
             }  
       }
       res.json({Status:"Success",Message:"Data Entry Updated Added successfully", Data :final_Data , Data_count:final_Data.length, Code:200});
   }
  catch(e){
     return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
  }
});



router.post('/get_authfinalizedata_bydate', async function (req, res) {
  try{
      var start_date = new Date(req.body.start_date);
      // var sdate = +start_date.getDate();
      // var smonth = +start_date.getMonth() + 1;
      // var syear = +start_date.getFullYear();
      var  start_date_count = start_date;
      // console.log("start_time",start_date_count);
     var  end_date = new Date(req.body.end_date);
      // var edate = +end_date.getDate();
      // var emonth = +end_date.getMonth() + 1;
      // var eyear = +end_date.getFullYear();
     var end_date_count = end_date;
      // console.log("end_time",end_date_count);
    // var EmployeeDetails = await EmployeeModel.findOne({_id:req.body.Employee_id}).populate('Department');
    // let EntryDetails = await DataEntryModel.find({Authorized_To:req.body.Employee_id,Savage_Status:"Finalize"}).populate({path: 'DataItemCode Submitted_By_Employee', populate: { path: 'Entry'}}).sort({"updatedAt":-1});
    
    var EntryDetails = await DataEntryModel.find({}).populate('DataItemCode Entry Authorized_To Submitted_By_Employee Department').sort({"updatedAt":-1});

     var final_data = [];
      for(let a  = 0 ; a < EntryDetails.length ; a ++){
      var dateconvert = new Date(EntryDetails[a].auth_Submitted_Date);
      // var date = +dateconvert.getDate();
      // var month = +dateconvert.getMonth() + 1;
      // var year = +dateconvert.getFullYear();
      var sub_date_count = dateconvert;
      // console.log("sub_Date",sub_date_count);
      // console.log(start_date_count);
      // console.log(end_date_count);
      // console.log(sub_date_count);
      if (sub_date_count > start_date_count && sub_date_count < end_date_count){
      final_data.push(EntryDetails[a]);
      }
      if(a == EntryDetails.length - 1){
        // console.log(final_data);
         // console.log(EntryDetails);
         res.json({Status:"Success",Message:"EntryDetails", Data : final_data,Code:200});
      }
    }
  }
  catch(e){
     return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
  }
});




router.post('/submittedcodelist', async function (req, res) {
  try{
    let EntryDetails = await DataEntryModel.find({Employee_id:req.body.Employee_id,Savage_Status:"Finalize",Financial_Year:req.body.Financial_Year}).populate({path: 'DataItemCode Authorized_To', populate: { path: 'Entry'}}).sort({'Submitted_Date':-1}).sort({"updatedAt":-1});
     EntryDetails.sort(function(a, b) {
    return parseFloat(a.DataItemCode.Report_SNo) - parseFloat(b.DataItemCode.Report_SNo);
     });
         res.json({Status:"Success",Message:"EntryDetails", Data : EntryDetails ,Code:200});

  }
  catch(e){
     return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
  }
});


router.post('/submittedcodelist1', async function (req, res) {
  try{
    let EntryDetails = await DataEntryModel.find({Employee_id:req.body.Employee_id,Savage_Status:"Finalize",Financial_Year:req.body.Financial_Year}).populate({path: 'DataItemCode Authorized_To', populate: { path: 'Entry'}}).sort({'Submitted_Date':-1}).sort({"updatedAt":-1});
    // res.json({Status:"Success",Message:"EntryDetails", Data : EntryDetails ,Code:200});
       Entry_freq = [];
       Date_Filter = [];
       item_code_fiter = [];
       Department_filter = [];
       final_Data = [];
       if(req.body.Entry_type == "All"){
          Entry_freq = await DataEntryModel.find({Employee_id:req.body.Employee_id,Savage_Status:"Finalize",Financial_Year:req.body.Financial_Year}).populate({path: 'DataItemCode Authorized_To', populate: { path: 'Entry'}}).sort({'Submitted_Date':-1}).sort({"updatedAt":-1});
       }else{
          Entry_freq = await DataEntryModel.find({Employee_id:req.body.Employee_id,Savage_Status:"Finalize",Entry:req.body.Entry_type,Financial_Year:req.body.Financial_Year}).populate({path: 'DataItemCode Authorized_To', populate: { path: 'Entry'}}).sort({'Submitted_Date':-1}).sort({"updatedAt":-1});
       }
       // console.log(Entry_freq[0].Entry);
       if(req.body.From_date == "All" && req.body.To_date == "All"){
           Date_Filter = Entry_freq;
       }else{
                 for(let a = 0 ; a < Entry_freq.length ; a++){
                     var start_date = new Date(req.body.From_date);
                     var end_date =  new Date(req.body.To_date);
                     var entered_date =  new Date(Entry_freq[a].Entry_Date);
                      if(entered_date <= end_date && entered_date >= start_date){
                        console.log("True");
                        Date_Filter.push(Entry_freq[a]);
                      }
                 }
       }
       if(req.body.Item_code == "All"){
           item_code_fiter = Date_Filter;
       }else{
             for(let a = 0 ; a < Date_Filter.length ; a ++){
                if(Date_Filter[a].DataItemCode.Data_Item == req.body.Item_code){
                  item_code_fiter.push(Date_Filter[a]);
                } 
             }
       }if(req.body.Status == "All"){
               Department_filter = item_code_fiter;
               final_Data = Department_filter;
       }else{
           if(req.body.Status == "WaitingforApproval"){
           for(let a = 0 ; a < item_code_fiter.length ; a ++){
                if(item_code_fiter[a].Admin_Request_Status == '' && item_code_fiter[a].Authorized_Action == ''){
                  final_Data.push(item_code_fiter[a]);
                } 
             } 
           }else if(req.body.Status == "Rejected"){             
             for(let a = 0 ; a < item_code_fiter.length ; a ++){
                if(item_code_fiter[a].Admin_Request_Status == '' && item_code_fiter[a].Authorized_Action == 'Rejected' || item_code_fiter[a].Admin_Request_Status == 'Rejected' && item_code_fiter[a].Authorized_Action == 'Rejected' || item_code_fiter[a].Admin_Request_Status == 'Rejected' && item_code_fiter[a].Authorized_Action == ''){
                  final_Data.push(item_code_fiter[a]);
                } 
             } 
           }else if(req.body.Status == "Approved"){
             for(let a = 0 ; a < item_code_fiter.length ; a ++){
                if(item_code_fiter[a].Admin_Request_Status == 'Approved'){
                  final_Data.push(item_code_fiter[a]);
                } 
             }
           } 
       }
       res.json({Status:"Success",Message:"Data Entry Updated Added successfully", Data :final_Data , Data_count:final_Data.length, Code:200});
  }
  catch(e){
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



router.get('/deletes', function (req, res) {
      DataEntryModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Entry datas Deleted successfully", Data : {} ,Code:200});
      });
});





module.exports = router;