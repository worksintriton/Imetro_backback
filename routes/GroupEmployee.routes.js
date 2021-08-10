var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var EmployeeModel = require('./../models/EmployeeModel');
var SuperAdminModel = require('./../models/SuperAdminModel');
var DataItemCodeModel = require('./../models/GroupdataitemcodeModel');
var DataEntryModel = require('./../models/GroupDataEntryModel');
//var PermissionModel = require('./../models/PermissionModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create',[
    //check('Department').not().isEmpty().withMessage("Not a valid Department"),
    //check('DataItemCode').not().isEmpty().withMessage("Please provide valid DataItemCode")
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
    var Employeecheck = await EmployeeModel.findOne({Emp_ID:req.body.Emp_ID});
    if(Employeecheck != null){
    	res.json({Status:"Failed",Message:"Employee with ID already exists", Data : {},Code:300});
    }
    else{
    	await EmployeeModel.create({

         Department:req.body.Department,
         DataItemCode:req.body.DataItemCode ,
         Employee_Name:req.body.Employee_Name || "",
         Category:req.body.Category,
         Authorized_To:req.body.Authorized_To || "5349b4ddd2781d08c09890f3",
         Password:req.body.Password  || "",
         Emp_ID:req.body.Emp_ID  || "",
         Phone : req.body.Phone  || "",
         Email_Id : req.body.Email_Id  || "",
         Role: req.body.Role  || "",
         User_Type:req.body.User_Type || ""
        },
       async function (err, user) {
          if(user!==null){
            if(req.body.User_Type === "User")
            {
            //var DataItemcodeupdate = await DataEntryModel.update({DataItemCode: {$in :req.body.DataItemCode}}, {$set:{User_code_Assigned_Status: true}}, {multi: true});
            var DataItemcodeupdate = await DataItemCodeModel.updateMany({_id:{$in:req.body.DataItemCode}},{$push:{Department:req.body.Department}});
            res.json({Status:"Success",Message:"User Created successfully", Data :user ,Code:200}); 
            }
            else{
               var DataItemcodeupdate = await DataItemCodeModel.updateMany({_id:{$in:req.body.DataItemCode}},{$push:{Department:req.body.Department}});
              //var DataItemcodeupdate = await DataEntryModel.update({DataItemCode: {$in :req.body.DataItemCode}}, {$set:{Authorized_code_Assigned_Status: true}}, {multi: true});
              res.json({Status:"Success",Message:"User Created successfully", Data :user ,Code:200}); 
            }
          }
          else{
              res.json({Status:"Failed",Message:"Issue with the itemcode updation", Data : {},Code:300});
         }  
    });      
  }    
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.post('/login', async function (req, res) {
        await EmployeeModel.findOne({Emp_ID:req.body.Email_Id,Password:req.body.Password}, function (err, EmployeeDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(EmployeeDetails == ""){
            return res.json({Status:"Failed",Message:"No User Found", Data : {},Code:404});
           }
         else
           {
           	//var financialyearcheck = await DataEntryModel.find({Financial_Start_Year:req.body.Start_Year,Financial_End_Year:req.body.End_Year});
           	res.json({Status:"Success",Message:"EmployeeDetails", Data : EmployeeDetails ,Code:200});
           }
        }).populate('Authorized_To');
});

router.post('/viewdetails', async function (req, res) {
        await EmployeeModel.findOne({_id:req.body.Employee_id}, function (err, EmployeeDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(EmployeeDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"EmployeeDetails", Data : EmployeeDetails ,Code:200});
        }).populate('DataItemCode Department Authorized_To');
});

router.get('/getlist', async function (req, res) {
        
        await EmployeeModel.find({User_Type:{$in:["User","Authorized"]}}, function (err, EmployeeDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(EmployeeDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
           else{
            res.json({Status:"Success",Message:"EmployeeDetails", Data : EmployeeDetails ,Code:200});
           }
          
        }).populate('DataItemCode Department Authorized_To').sort({createdAt:-1});
});

router.post('/authchecklist', async function (req, res) {
        
        await EmployeeModel.find({Department:req.body.Department,User_Type:"Authorized"}, function (err, EmployeeDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(EmployeeDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"EmployeeDetails", Data : EmployeeDetails ,Code:200});
        }).sort({createdAt:-1});
});



router.post('/department_user', async function (req, res) {
        await EmployeeModel.find({Department:req.body.Department}, function (err, EmployeeDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(EmployeeDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"EmployeeDetails", Data : EmployeeDetails ,Code:200});
        }).sort({createdAt:-1});
});




router.post('/getentrylist', async function (req, res) {
        await DataEntryModel.find({Employee_id:req.body.Employee_id,Entry:req.body.Entry}, function (err, EmployeeDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(EmployeeDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"EmployeeDetails", Data : EmployeeDetails ,Code:200});
        }).populate({path: 'DataItemCode', populate: { path: 'Entry'}, populate: { path: 'Unit'}}).sort({createdAt:-1});
});

router.post('/getstatuslist', async function (req, res) {
        await DataEntryModel.find({Employee_id:req.body.Employee_id,Request_Approval_Status:req.body.Status}, function (err, EmployeeDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(EmployeeDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"EmployeeDetails", Data : EmployeeDetails ,Code:200});
        }).populate({path: 'DataItemCode', populate: { path: 'Entry'}}).sort({createdAt:-1});
});


router.post('/getdatelist', async function (req, res) {
        await DataEntryModel.find({Employee_id:req.body.Employee_id,Entry_Date:req.body.Entry_Date}, function (err, EmployeeDetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(EmployeeDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"EmployeeDetails", Data : EmployeeDetails ,Code:200});
        }).populate('DataItemCode Department').sort({createdAt:-1});
});





router.post('/approvestatus', async function (req, res) {
  try{
    if(req.body.Status == "Approved")
    {
      var UpdatedData = await DataEntryModel.findByIdAndUpdate({_id:req.body.DataEntry_id},{Request_Approval_Status:req.body.Status,Authorized_Action:req.body.Status,Authorized_By:req.body.Employee_id,auth_Submitted_Date:req.body.auth_Submitted_Date},{
  new: true});
      var getlist = await DataEntryModel.find({Authorized_To:req.body.Authorized_To,Savage_Status:"Finalize",Authorized_Action:""});
      return res.json({Status:"Success",Message:"Status Updated Successfully", Data : getlist ,Code:200});
  }
  else{
var UpdatedData = await DataEntryModel.findByIdAndUpdate({_id:req.body.DataEntry_id},{Request_Approval_Status:req.body.Status,Authorized_By:req.body.Employee_id,Authorized_Action:req.body.Status,Authorized_Reason_for_Rejection:req.body.Reason,auth_Submitted_Date:req.body.auth_Submitted_Date},{
  new: true});
var getlist = await DataEntryModel.find({Authorized_To:req.body.Authorized_To,Savage_Status:"Finalize",Authorized_Action:""});
return res.json({Status:"Success",Message:"Status Updated successfully", Data : getlist ,Code:200});
  }
}
catch(e){
 return res.json({Status:"Failed",Message:"Internal server Error", Data : {},Code:500});
}
});




router.post('/auth_retry', async function (req, res) {
  try{
    if(req.body.Status == "Approved")
    {
      // var getlist = await DataEntryModel.find({_id:req.body.DataEntry_id});
      // console.log(getlist);
      var UpdatedData = await DataEntryModel.findByIdAndUpdate({_id:req.body.DataEntry_id},{Request_Approval_Status:req.body.Status,Authorized_Action:"",Authorized_By:req.body.Employee_id,Admin_Request_Status:req.body.Admin_Request_Status,Remarks:req.body.Remarks,Value:req.body.Value},{
  new: true});
      var getlist = await DataEntryModel.find({Authorized_To:req.body.Authorized_To,Savage_Status:"Finalize"});
      return res.json({Status:"Success",Message:"Status Updated Successfully", Data : getlist ,Code:200});
  }
  else{
var UpdatedData = await DataEntryModel.findByIdAndUpdate({_id:req.body.DataEntry_id},{Request_Approval_Status:req.body.Status,Authorized_By:req.body.Employee_id,Authorized_Action:req.body.Status,Authorized_Reason_for_Rejection:req.body.Reason,Admin_Request_Status:"",Remarks:req.body.Remarks,Value:req.body.Value},{
  new: true});
var getlist = await DataEntryModel.find({Authorized_To:req.body.Authorized_To,Savage_Status:"Finalize",Authorized_Action:"",Admin_Request_Status:""});
return res.json({Status:"Success",Message:"Status Updated successfully", Data : getlist ,Code:200});
  }
}
catch(e){
 return res.json({Status:"Failed",Message:"Internal server Error", Data : {},Code:500});
}
});




// router.post('/authentrylist', async function (req, res) {
//   try{
//     var EmployeeDetails = await EmployeeModel.findOne({_id:req.body.Employee_id}).populate('Department');
//     console.log(EmployeeDetails);
//     let EntryDetails = await DataEntryModel.find({Department:EmployeeDetails.Department,DataItemCode:{$in :EmployeeDetails.DataItemCode}}).populate({path: 'DataItemCode', populate: { path: 'Entry'}});
//     res.json({Status:"Success",Message:"EntryDetails", Data : EntryDetails ,Code:200});
//   }
//   catch(e){
//     console.log(e)
//      return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
//   }
// });



router.post('/authentrylist_bydate', async function (req, res) {
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
    var EmployeeDetails = await EmployeeModel.findOne({_id:req.body.Employee_id}).populate('Department');
    let EntryDetails = await DataEntryModel.find({Authorized_To:req.body.Employee_id,Savage_Status:"Finalize"}).populate({path: 'DataItemCode Submitted_By_Employee', populate: { path: 'Entry'}}).sort({"updatedAt":-1});
     var final_data = [];
      for(let a  = 0 ; a < EntryDetails.length ; a ++){
      console.log(EntryDetails[a].user_Submitted_Date);
      var dateconvert = new Date(EntryDetails[a].user_Submitted_Date);
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
    console.log(e)
     return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
  }
});



router.post('/authentrylist', async function (req, res) {
  try{
    console.log(req.body);
    var EmployeeDetails = await EmployeeModel.findOne({_id:req.body.Employee_id}).populate('Department');
    // console.log("EmployeeDetails",EmployeeDetails);
    var TempData= await DataEntryModel.find({Authorized_To:req.body.Employee_id});
    console.log('TempData',TempData);
    let EntryDetails = await DataEntryModel.find({Authorized_To:req.body.Employee_id,Savage_Status:"Finalize",Financial_Year:req.body.Financial_Year}).populate({path: 'DataItemCode Submitted_By_Employee Authorized_To', populate: { path: 'Entry'}}).sort({"updatedAt":-1});
    EntryDetails.sort(function(a, b) {
    return parseFloat(a.DataItemCode.Report_SNo) - parseFloat(b.DataItemCode.Report_SNo);
     });
    res.json({Status:"Success",Message:"EntryDetails", Data : EntryDetails ,Code:200});   
  }
  catch(e){
     return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
  }
});


router.post('/authentrylist2', async function (req, res) {
  try{
    var EmployeeDetails = await EmployeeModel.findOne({_id:req.body.Employee_id}).populate('Department');
    // console.log("EmployeeDetails",EmployeeDetails);
    var TempData= await DataEntryModel.find({Authorized_To:req.body.Employee_id});
    console.log('TempData',TempData);
    let EntryDetails = await DataEntryModel.find({Authorized_To:req.body.Employee_id,Savage_Status:"Finalize",Financial_Year:req.body.Financial_Year}).populate({path: 'DataItemCode Submitted_By_Employee Authorized_To', populate: { path: 'Entry'}}).sort({"updatedAt":-1});
    EntryDetails.sort(function(a, b) {
    return parseFloat(a.DataItemCode.Report_SNo) - parseFloat(b.DataItemCode.Report_SNo);
     });
    res.json({Status:"Success",Message:"EntryDetails", Data : EntryDetails ,Code:200});   
  }
  catch(e){
     return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
  }
});



router.post('/authentrylist1', async function (req, res) {
  try{
       Entry_freq = [];
       Date_Filter = [];
       item_code_fiter = [];
       Department_filter = [];
       final_Data = [];
       if(req.body.Entry_type == "All"){
          Entry_freq = await DataEntryModel.find({Authorized_To:req.body.Employee_id,Savage_Status:"Finalize",Financial_Year:req.body.Financial_Year}).populate({path: 'DataItemCode Submitted_By_Employee Authorized_To', populate: { path: 'Entry'}}).sort({"updatedAt":-1});
       }else{
          Entry_freq = await DataEntryModel.find({Authorized_To:req.body.Employee_id,Savage_Status:"Finalize",Entry:req.body.Entry_type,Financial_Year:req.body.Financial_Year}).populate({path: 'DataItemCode Submitted_By_Employee Authorized_To', populate: { path: 'Entry'}}).sort({"updatedAt":-1});
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



router.post('/approvedlist', async function (req, res) {
  try{
    let EntryDetails = await DataEntryModel.find({Department:req.body.Department,Authorized_Action:"Approved"}).populate({path: 'DataItemCode', populate: { path: 'Entry'}});
    res.json({Status:"Success",Message:"EntryDetails", Data : EntryDetails ,Code:200});
  }
  catch(e){
     return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
  }
});

router.post('/admindatalist', async function (req, res) {
  try{
    let EntryDetails = await DataEntryModel.find({Department:req.body.Department,Authorized_Action:"Approved"}).populate({path: 'DataItemCode', populate: { path: 'Entry'}});
    res.json({Status:"Success",Message:"EntryDetails", Data : EntryDetails ,Code:200});
  }
  catch(e){
     return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
  }
});

router.post('/adminentrylist', async function (req, res) {
  try{
    let EntryDetails = await DataEntryModel.find({Entry:req.body.Entry}).populate({path: 'DataItemCode', populate: { path: 'Entry'}});
    res.json({Status:"Success",Message:"EntryDetails", Data : EntryDetails ,Code:200});
  }
  catch(e){
     return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
  }
});

router.post('/adminstatuschange', async function (req, res) {

  try{
    let StatusChange = await DataEntryModel.findByIdAndUpdate({_id:req.body.DataEntry_id},{Admin_Request_Status:req.body.Status,Admin_Reason_for_Rejection:req.body.Reason,admin_Submitted_Date:req.body.admin_Submitted_Date});
    res.json({Status:"Success",Message:"EntryDetails", Data : StatusChange ,Code:200});
  }
  catch(e){
     return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
  }
});


router.post('/finalstatuschange', async function (req, res) {
  try{
    let StatusChange = await DataEntryModel.findByIdAndUpdate({_id:req.body.DataEntry_id},{Final_Status:req.body.Status});
    res.json({Status:"Success",Message:"EntryDetails", Data : StatusChange ,Code:200});
  }
  catch(e){
     return res.json({Status:"Failed",Message:"Internal Server error", Data : {},Code:500});
  }
});

// router.post('/usertypecatlist', async function (req, res) {
//   var DataItemlist1 = await DataItemCodeModel.find({Department:{ $in:req.body.Department}});
//   if(DataItemlist1 == ""){
//     var DataItemlist = await DataItemCodeModel.find({Category:req.body.Category});
//      res.json({Status:"Success",Message:"EmployeeDetails", Data : DataItemlist ,Code:200});
//   }
//   else{
//       if(req.body.User_Type === "User"){
//      var DataItemlist = await DataItemCodeModel.find({Category:req.body.Category},{Authorized_code_Assigned_Status:false});
//      res.json({Status:"Success",Message:"EmployeeDetails", Data : DataItemlist ,Code:200});
//   }
//   else{
//     var DataItemlist = await DataItemCodeModel.find({Category:req.body.Category,User_code_Assigned_Status:false}); 
//      res.json({Status:"Success",Message:"EmployeeDetails", Data : DataItemlist ,Code:200});
//   }
// }
// });

router.post('/authcatlist', async function (req, res) {
  try{
    var DataItemlist = await DataItemCodeModel.find({Category:req.body.Category});
     res.json({Status:"Success",Message:"Data Item code list", Data : DataItemlist ,Code:200});
  }
  catch(e)
  {
      res.json({Status:"Success",Message:"Internal Server Error", Data : {} ,Code:200});
  }
});

router.post('/usertypecatlist', async function (req, res) {
  try{
    var Authlist = await EmployeeModel.findOne({_id:req.body.Authorized_To});
    var DataItemlist = await DataItemCodeModel.find({_id: {$in : Authlist.DataItemCode}});
     res.json({Status:"Success",Message:"Data Item code list", Data : DataItemlist ,Code:200});
  }
  catch(e)
  {
      res.json({Status:"Success",Message:"Internal Server Error", Data : {} ,Code:200});
  }
});

// router.post('/usertypelist', async function (req, res) {
//   if(req.body.User_Type === "User"){
//      var DataItemlist = await DataItemCodeModel.find({User_code_Assigned_Status:false});
//      res.json({Status:"Success",Message:"EmployeeDetails", Data : DataItemlist ,Code:200});
//   }
//   else{
//      var DataItemlist = await DataItemCodeModel.find({Authorized_code_Assigned_Status:false});
//       res.json({Status:"Success",Message:"EmployeeDetails", Data : DataItemlist ,Code:200});
//   }
// });




router.post('/employee_edit', async function (req, res) {
        await EmployeeModel.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"Entry Details Updated successfully", Data : UpdatedDetails ,Code:200});
        });
});



router.post('/edit', async function (req, res) {
	var DataItemcodedetails = await EmployeeModel.findOne({_id:req.body.Employee_id}).select('DataItemCode User_Type');
	if(DataItemcodedetails.User_Type === "User"){
	var DataItemcodeupdate = await DataEntryModel.update({DataItemCode:{$in:DataItemcodedetails.DataItemCode}},{ $set:{User_code_Assigned_Status: false}},{multi: true});
	}
	else{
	var DataItemcodeupdate = await DataEntryModel.update({DataItemCode:{$in:DataItemcodedetails.DataItemCode}},{ $set:{Authorized_code_Assigned_Status: false}},{multi: true});
	}
     await EmployeeModel.findByIdAndUpdate(req.body.Employee_id, req.body, {new: true}, async function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
           if(UpdatedDetails.User_Type === "User"){
	var DataItemcodeupdate = await DataEntryModel.update({DataItemCode:{$in:req.body.DataItemCode}},{ $set:{User_code_Assigned_Status: true}},{multi: true});
	}
	else{
	var DataItemcodeupdate = await DataEntryModel.update({DataItemCode:{$in:req.body.DataItemCode}},{ $set:{Authorized_code_Assigned_Status: true}},{multi: true});
	}
             res.json({Status:"Success",Message:"Employee Details Updated successfully", Data : UpdatedDetails ,Code:200});
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



router.get('/deletes', function (req, res) {
      EmployeeModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Entry datas Deleted successfully", Data : {} ,Code:200});
      });
});


module.exports = router;