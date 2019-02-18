var mongoose = require('mongoose');  
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var uniqueValidator = require('mongoose-unique-validator');


var CCSSchema = new mongoose.Schema(
{
    course_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Course', required: true },
    specialisation_id: {type:mongoose.Schema.Types.ObjectId, ref : 'Specialization', required: true },
},
{
    timestamps:true
});

CCSSchema.plugin(uniqueValidator);
CCSSchema.plugin(mongooseAggregatePaginate);
mongoose.model('Course_specialization', CCSSchema);

module.exports = mongoose.model('Course_specialization');