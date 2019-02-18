var mongoose = require('mongoose');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var mongoose_delete=require('mongoose-delete')


var collegeSchema = new mongoose.Schema(
{
  
    student_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Student_Enrollment', required: true }, 
    vacancy_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Vacancy', required: true }, 
},
{
    timestamps:true
});

collegeSchema.plugin(mongoose_delete)
collegeSchema.plugin(mongooseAggregatePaginate);
collegeSchema.plugin(uniqueValidator);
mongoose.model('Suggestion', collegeSchema);

module.exports = mongoose.model('Suggestion');