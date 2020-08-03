var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var UnitSchema = new mongoose.Schema({   
  
  Unit_Name: String,

  //Date: Date,

});

UnitSchema.plugin(timestamps);

mongoose.model('Unit', UnitSchema);

module.exports = mongoose.model('Unit');