var mongoose = require('mongoose');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var random=require('mongoose-simple-random')

var universitySchema = new mongoose.Schema(
{
    vacancy_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Vacancy', required: true }, 
    course_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Course', required: true }, 
   
},
{
    timestamps:true
});

universitySchema.plugin(random);
universitySchema.plugin(mongooseAggregatePaginate);
universitySchema.plugin(uniqueValidator);
mongoose.model('Vacancy_course', universitySchema);

module.exports = mongoose.model('Vacancy_course');