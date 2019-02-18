var mongoose = require('mongoose');  
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var mongoose_delete=require('mongoose-delete')


var courseSchema = new mongoose.Schema(
{
    name : {type: String, required: true, max: 25,unique:true,collation:{locale:'en',strenth:2}, trim: true},
    code : {type: String, required: true, max: 25,unique:true, trim: true},
    duration : {type: Number, required: true},
    marking_criteria : {type: String, required: true, trim: true},
    academic_term : {type: String, required: true, trim: true},
    description : {type: String, trim: true, required: false}, 
    status : {type: String, trim: true, required: false,default:"active"}, 
},
{
    timestamps:true
});

courseSchema.plugin(mongoose_delete)
courseSchema.plugin(mongooseAggregatePaginate);
courseSchema.plugin(uniqueValidator);
mongoose.model('Course', courseSchema);

module.exports = mongoose.model('Course');