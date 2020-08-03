var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var DepartmentSchema = new mongoose.Schema({   
  
  Department_Name: String,

  Date: Date,

});

DepartmentSchema.plugin(timestamps);

mongoose.model('Department', DepartmentSchema);

module.exports = mongoose.model('Department');