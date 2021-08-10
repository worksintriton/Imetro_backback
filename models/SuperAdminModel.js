var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var AdminSchema = new mongoose.Schema({   

Name: String,

Password:String,

User_Type:String,

Phone:Number,

Email_Id: String,

});

AdminSchema.plugin(timestamps);

mongoose.model('Admin', AdminSchema);

module.exports = mongoose.model('Admin');