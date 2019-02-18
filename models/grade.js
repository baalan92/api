var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');



var universitySchema = new mongoose.Schema(
{
    student_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Student_Enrollment', required: true },
    course_type:{type:String,required:true}, 
    period_number : {type: Number,required:true}, 
    grades : {type: String,required:false},   
},
{
    timestamps:true
});

universitySchema.plugin(mongooseAggregatePaginate);
mongoose.model('Grade', universitySchema);
universitySchema.plugin(uniqueValidator);
module.exports = mongoose.model('Grade');