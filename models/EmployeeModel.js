var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var EmployeeSchema = new mongoose.Schema({   

Department: {  
      type: Schema.Types.ObjectId,
        ref: 'Department',
    },
DataItemCode: [{  
      type: Schema.Types.ObjectId,
        ref: 'DataItemCode',
    }],

Employee_Name: String,

Password:String,

Emp_ID: String,

Phone:Number,

Email_Id: String,

Role: {  
      type: Schema.Types.ObjectId,
        ref: 'Permissions',
    }

});

EmployeeSchema.plugin(timestamps);

mongoose.model('Employee', EmployeeSchema);

module.exports = mongoose.model('Employee');