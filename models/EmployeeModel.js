var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var EmployeeSchema = new mongoose.Schema({   

Department: {  
      type: Schema.Types.ObjectId,
        ref: 'Department',
    },
Category: {  
      type: Schema.Types.ObjectId,
        ref: 'Category',
    },
Authorized_To: {  
      type: Schema.Types.ObjectId,
        ref: 'Employee',
    },

DataItemCode: [{  
      type: Schema.Types.ObjectId,
        ref: 'DataItemCode',
    }],

Employee_Name: String,

Password:String,

Emp_ID: String,

User_Type:String,

Phone:Number,

Email_Id: String,

Role: Array

// Role: {  
//       type: Schema.Types.ObjectId,
//         ref: 'Permissions',
//     }

});

EmployeeSchema.plugin(timestamps);

mongoose.model('Employee', EmployeeSchema);

module.exports = mongoose.model('Employee');