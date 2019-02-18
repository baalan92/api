var mongoose = require('mongoose');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var mongoose_delete=require('mongoose-delete')

var universitySchema = new mongoose.Schema(
{
    student_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Student_Enrollment', required: true }, 
    vacancy_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Vacancy', required: true }, 
    status : {type: String, trim: true}, 
    
},
{
    timestamps:true
});

universitySchema.plugin(mongoose_delete)
universitySchema.plugin(mongooseAggregatePaginate);
universitySchema.plugin(uniqueValidator);
mongoose.model('Offer', universitySchema);

module.exports = mongoose.model('Offer');