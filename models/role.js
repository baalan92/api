var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var universitySchema = new mongoose.Schema(
{
    name : {type: String, required: true, unique:true,collation:{locale:'en',strenth:2}, max: 25, trim: true},
    description : {type: String},    
},
{
    timestamps:true
});

mongoose.model('Role', universitySchema);
universitySchema.plugin(uniqueValidator);
module.exports = mongoose.model('Role');