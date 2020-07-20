var mongoose = require('mongoose');  
var DataOperationalDescriptionSchema = new mongoose.Schema({  
  ItemCode: {  
      type: Schema.Types.ObjectId,
        ref: 'DataOperations',
    },
  Heading: String,
  Description: String,
  Explanation: String,
  Unit: String,
  Comprises: String,
  Except: String,
});
mongoose.model('DataOperationsDescription', DataOperationalDescriptionSchema);

module.exports = mongoose.model('DataOperationsDescription');