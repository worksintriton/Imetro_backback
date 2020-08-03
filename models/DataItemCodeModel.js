var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var DataIteamCodeSchema = new mongoose.Schema({   

Category: {  
      type: Schema.Types.ObjectId,
        ref: 'Category',
    },
Entry: {  
      type: Schema.Types.ObjectId,
        ref: 'Entry',
    },

Item_Code: String,

Formula:String,

Item_Name: String,

Data_Item:String,

Heading: String,

Description: String,

Explanation: String,

Unit:  {  
      type: Schema.Types.ObjectId,
        ref: 'Unit',
    },

Comprises: String,

Except: String,

Financial_Start_Year: Number,

Financial_End_Year:Number,

Value: String,

Remarks: String,

Entry_Date: Date,

Savage_Status: String,

Submitted_By_Employee:  {  
      type: Schema.Types.ObjectId,
        ref: 'Employee',
    },

Authorized_By: {  
      type: Schema.Types.ObjectId,
        ref: 'Employee',
    },

 Request_Approval_Status: String,

 Authorized_Action: String,

 Authorized_Reason_for_Rejection:String

 Admin_Approval_Status:String,

 Admin_Reason_for_Rejection:String,

});

DataIteamCodeSchema.plugin(timestamps);

mongoose.model('DataItemCode', DataIteamCodeSchema);

module.exports = mongoose.model('DataItemCode');