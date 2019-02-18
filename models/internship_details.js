var mongoose = require('mongoose');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var mongoose_delete=require('mongoose-delete')

var universitySchema = new mongoose.Schema(
{
    employer : {type:String, required: false },
    internship_details : {type:String, required: false },
    internship_duration : {type:String, required: false },
    project : {type:String, required: false },
    student_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Student_Enrollment', required: true }, 
},
{
    timestamps:true
});

universitySchema.plugin(mongoose_delete)
universitySchema.plugin(mongooseAggregatePaginate);
universitySchema.plugin(uniqueValidator);
mongoose.model('Internship', universitySchema);

module.exports = mongoose.model('Internship');