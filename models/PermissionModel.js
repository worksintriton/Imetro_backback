var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var PermissionScehma = new mongoose.Schema({   

Employee_id:  {  
      type: Schema.Types.ObjectId,
        ref: 'Employee',
    },

View: String,

Edit:String,

Add: String,

Approval:String,

});

PermissionScehma.plugin(timestamps);

mongoose.model('Permissions', PermissionScehma);

module.exports = mongoose.model('Permissions');