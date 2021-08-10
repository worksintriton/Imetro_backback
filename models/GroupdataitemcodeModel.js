var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var GroupDataIteamCodeSchema = new mongoose.Schema({   

Category: String,
Entry: {  
      type: Schema.Types.ObjectId,
        ref: 'Entry',
    },
Department:[ {
  type: Schema.Types.ObjectId,
        ref: 'Department',
}],

Unit_Name: String,

Report_SNo:Number,

ItemCode: String,

Formula:String,

Item_Name: String,

Data_Item:String,

Heading: String,

Description: String,

Explanation: String,

Formula_type:String,

//User_Type:String,

User_code_Assigned_Status:{
        type: Boolean,
        default: false
    },

Authorized_code_Assigned_Status: {
        type: Boolean,
        default: false
    },

Unit:  {  
      type: Schema.Types.ObjectId,
        ref: 'Unit',
    },

Comprises: String,

Except: String,

Financial_Start_Year: Number,

Financial_End_Year: Number,

});

GroupDataIteamCodeSchema.plugin(timestamps);

mongoose.model('GroupDataItemCode', GroupDataIteamCodeSchema);

module.exports = mongoose.model('GroupDataItemCode');