var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var groupuserItemcodeSchema = new mongoose.Schema({   
  
  Item_code_id: {  
      type: Schema.Types.ObjectId,
        ref: 'GroupDataItemCode',
    },
  Department_id: {  
      type: Schema.Types.ObjectId,
        ref: 'Department',
    },
  User_id: {  
      type: Schema.Types.ObjectId,
        ref: 'Employee',
    },

});

groupuserItemcodeSchema.plugin(timestamps);

mongoose.model('groupuserItemcode', groupuserItemcodeSchema);

module.exports = mongoose.model('groupuserItemcode');