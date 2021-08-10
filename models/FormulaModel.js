var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var FormulaSchema = new mongoose.Schema({   
  
  Item_code_id: {
  type: Schema.Types.ObjectId,
        ref: 'DataItemCode',
  },
  Method_type: String,
  Itemcode_list: [{
  type: Schema.Types.ObjectId,
        ref: 'DataItemCode',
}],
  Code_type : String,

  For_add_status : String,


});

FormulaSchema.plugin(timestamps);

mongoose.model('Formula', FormulaSchema);

module.exports = mongoose.model('Formula');