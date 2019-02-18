var mongoose = require('mongoose');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var mongoose_delete=require('mongoose-delete')


var universitySchema = new mongoose.Schema(
{
    student_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Student_Enrollment', required: true }, 
    employer_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Employer', required: true }, 
    vacancy_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Vacancy', required: true }, 
    msg : {type: String, trim: true},
    status : {type: String, trim: true}, 
    date : {type: Date, trim: true, default: Date.now()}, 
    is_view : {type: Boolean, trim: true, default: false}, 
},
{
    timestamps:true
});

universitySchema.plugin(mongoose_delete)
universitySchema.plugin(mongooseAggregatePaginate);
universitySchema.plugin(uniqueValidator);
mongoose.model('Notification', universitySchema);

module.exports = mongoose.model('Notification');