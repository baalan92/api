var mongoose = require('mongoose');  

var passwordResetSchema = new mongoose.Schema(
{
  // email: {type: String},
  // key: {type: String},
  // key_received: {type :Date, required: false, default: Date.now },
  // is_used: {type: Boolean, default:false}, 
  // location: { type: String, required: false },
  // ip: {type: String, required: false },
  // mac: {type: String, required: false },
  // is_granted: {type: Boolean, default:false}, 
},
{
  timestamps:true
});

mongoose.model('Password_Reset', passwordResetSchema);
module.exports = mongoose.model('Password_Reset');