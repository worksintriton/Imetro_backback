var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var CategorySchema = new mongoose.Schema({   
  
  Category_Name: String,

  //Date: Date,

});

CategorySchema.plugin(timestamps);

mongoose.model('Category', CategorySchema);

module.exports = mongoose.model('Category');