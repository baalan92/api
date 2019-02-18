var mongoose = require('mongoose');  

// Here we create a schema called User with the following fields.
var userSchema = new mongoose.Schema(
{
    name : {type: String, required: true, max: 25, trim: true}, 
},
{
    timestamps:true
});

mongoose.model('Authority', userSchema);

module.exports = mongoose.model('Authority');