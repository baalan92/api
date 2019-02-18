var mongoose = require('mongoose');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var mongoose_delete=require('mongoose-delete')


var collegeSchema = new mongoose.Schema(
{
    name : {type: String, required: true, max: 25,unique:true,collation:{locale:'en',strenth:2}, trim: true},
    email : {type: String, required: true, lowercase: true, unique:true, trim: true, sparse: true},
    contact_no : {type: String, required: true,unique:true, min: 13, max : 13},
    college_code : {type: String, required: true, max: 25, trim: true},
    year : {type: String, max: 4, min : 4, trim: true, required: false}, 
    website : {type: String, trim: true}, 
    university_id : {type:mongoose.Schema.Types.ObjectId, ref : 'University', required: true }, 
    address : {type: String, required: true, max: 25, trim: true},
    state : {type: String, required: true, max: 25, trim: true},
    city : {type: String, required: true, max: 25, trim: true},
    pin_code : {type: String, required: true, max: 6, min: 6, trim: true},
    geolocation : {type: String, required: true},
    total_student : {type: String, required: false, trim: true},
    palcement_head_name : {type: String, required: true, max: 25, trim: true},
    placement_head_email : {type: String, required: true,unique:true, lowercase: true, unique:true, trim: true, sparse: true},
    placement_head_contact_no : {type: String, required: true,unique:true, min: 13, max : 13},
    status : {type: String, trim: true, required: false,default:"active"}, 
},
{
    timestamps:true
});

collegeSchema.plugin(mongoose_delete)
collegeSchema.plugin(mongooseAggregatePaginate);
collegeSchema.plugin(uniqueValidator);
mongoose.model('College', collegeSchema);

module.exports = mongoose.model('College');