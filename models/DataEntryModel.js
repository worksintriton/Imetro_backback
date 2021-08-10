var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var SubmittedCodeSchema = new mongoose.Schema({   

Employee_id: {  
      type: Schema.Types.ObjectId,
        ref: 'Employee',
    },
Authorized_To: { 
      type: Schema.Types.ObjectId,
        ref: 'Employee',
    },

Department: { 
      type: Schema.Types.ObjectId,
        ref: 'Department',
    },

Entry:{
     type: Schema.Types.ObjectId,
        ref: 'Entry',
    },

DataItemCode: {  
      type: Schema.Types.ObjectId,
        ref: 'DataItemCode',
    },

Value: {
    type: String,
    default: ''
},

Remarks: {
    type: String,
    default: ''
},

Financial_Year: String,


Financial_Start_Year: String,

Financial_End_Year: String,

Entry_Date:  String,

user_Submitted_Date: {
    type: String,
    default: ""
},

auth_Submitted_Date: {
    type: String,
    default: ""
},

admin_Submitted_Date: {
    type: String,
    default: ""
},

Submitted_Time: {
    type: String,
    default: ''
},

Savage_Status: {
    type: String,
    default: ''
},

Submitted_By_Employee:  {  
      type: Schema.Types.ObjectId,
        ref: 'Employee',
    },
Submitted_By_Authorized:  {  
      type: Schema.Types.ObjectId,
        ref: 'Employee',
    },

Authorized_By: {  
      type: Schema.Types.ObjectId,
        ref: 'Employee',
    },

 Request_Approval_Status: {
    type: String,
    default: ''
},

 Authorized_Action: {
    type: String,
    default: ''
},

 Authorized_Reason_for_Rejection:{
    type: String,
    default: ''
},

 Admin_Request_Status: {
    type: String,
    default: ''
},

 Admin_Approval_Status:{
    type: String,
    default: ''
},

 Admin_Reason_for_Rejection:{
    type: String,
    default: ''
},

});

SubmittedCodeSchema.plugin(timestamps);

mongoose.model('DataEntry', SubmittedCodeSchema);

module.exports = mongoose.model('DataEntry');