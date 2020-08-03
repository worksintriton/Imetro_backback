var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var EntrySchema = new mongoose.Schema({   
  
  Entry_Name: String,

  //Date: Date,

});

EntrySchema.plugin(timestamps);

mongoose.model('Entry', EntrySchema);

module.exports = mongoose.model('Entry');