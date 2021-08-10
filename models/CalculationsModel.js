var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var calculationsSchema = new mongoose.Schema({   
  
  Unit_Name: String,

  //Date: Date,

});

UnitSchema.plugin(timestamps);

mongoose.model('calculations', calculationsSchema);

module.exports = mongoose.model('calculations');