var mongoose = require('mongoose');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var random=require('mongoose-simple-random')
var mongoose_delete=require('mongoose-delete')


var universitySchema = new mongoose.Schema(
{
    question : {type: String, required: true, lowercase: true, unique:true, trim: true},
    topic:{type: String, required: true},
    ans:{type: String, required: true,dropDups:true},
    // ans2:{type: String, required: true,dropDups:true},
    // ans3:{type: String, required: true,dropDups:true},
    // ans4:{type: String, required: true,dropDups:true},
    correct_ans:{type: String, required: true},
    status:{type:String,default:"active"}
},
{
    timestamps:true
});

universitySchema.plugin(mongoose_delete)
universitySchema.plugin(random);
universitySchema.plugin(mongooseAggregatePaginate);
universitySchema.plugin(uniqueValidator);
mongoose.model('Question', universitySchema);

module.exports = mongoose.model('Question');