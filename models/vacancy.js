var mongoose = require('mongoose');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var mongoose_delete=require('mongoose-delete')

var universitySchema = new mongoose.Schema(
{
    job_title : {type: String, required: true, max: 25, trim: true},
    number : {type: String, required: true, lowercase: true,trim: true, sparse: true},
    description : {type: String, required: false,},
    closing_date : {type: String, trim: true}, 
    date_from : {type: String, trim: true}, 
    date_to : {type: String, trim: true}, 
    venue : {type: String, trim: true}, 
    job_location : {type: String, trim: true, required: false},
    job_start_date : {type: String, trim: true, required: false},
    desired_skills : {type: String, trim: true, required: false},
    desired_educational_qualification : {type: String, trim: true, required: false},
    minimum_percentage : {type: String, trim: false, required: false},
    minimum_cgpa : {type: String, trim: false, required: false},
    minimum_grade : {type: String, trim: false, required: false},
    employer_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Employer', required: true }, 
    status : {type: String, trim: false, required: false,default:"active"},
},
{
    timestamps:true
});

universitySchema.plugin(mongoose_delete)
universitySchema.plugin(mongooseAggregatePaginate);
universitySchema.plugin(uniqueValidator);
mongoose.model('Vacancy', universitySchema);

module.exports = mongoose.model('Vacancy');