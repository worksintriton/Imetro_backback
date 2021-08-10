var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var FinancialyrsSchema = new mongoose.Schema({   
  
  Financialyrs: String,

  status : String,

  //Date: Date,

});

FinancialyrsSchema.plugin(timestamps);

mongoose.model('Financialyrs', FinancialyrsSchema);

module.exports = mongoose.model('Financialyrs');