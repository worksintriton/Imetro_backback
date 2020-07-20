var mongoose = require('mongoose');  
var DataOperationalSchema = new mongoose.Schema({  
  ItemCode:{
  	type:String,
  	unique: true,
  },
  Name: String,
});
mongoose.model('DataOperations', DataOperationalSchema);

module.exports = mongoose.model('DataOperations');