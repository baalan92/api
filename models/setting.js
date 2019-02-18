var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
// Here we create a schema called User with the following fields.
var userSchema = new mongoose.Schema(
{
    key : {type: String, required: true, max: 25, trim: false},
    value : {type: String, required: true, max: 25, trim: false},
},
{
    timestamps:true
});

mongoose.model('Setting', userSchema);
module.exports = mongoose.model('Setting');