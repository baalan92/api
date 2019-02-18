var mongoose = require('mongoose');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var mongoose_delete=require('mongoose-delete')

var universitySchema = new mongoose.Schema(
{
    name : {type: String, required: true, unique:true,collation:{locale:'en',strenth:2}, max: 25, trim: true},
    email : {type: String, required: true, lowercase: true, unique:true, trim: true, sparse: true},
    contact_no : {type: String, required: true, unique:true, min: 13, max : 13},
    website : {type: String, trim: true}, 
    description : {type: String, trim: true, required: false},
    address : {type: String, trim: true, required: true}, 
    status : {type: String, trim: true, required: false,default:"active"}, 
    year : {type: String, max: 4, min : 4, trim: true, required: false}, 
},
{
    timestamps:true
});

universitySchema.plugin(mongoose_delete)
universitySchema.plugin(mongooseAggregatePaginate);
universitySchema.plugin(uniqueValidator);
mongoose.model('University', universitySchema);

module.exports = mongoose.model('University');