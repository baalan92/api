var mongoose = require('mongoose'); 
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var mongoose_delete=require('mongoose-delete')


var specializationSchema = new mongoose.Schema(
{
    name : {type: String, required: true,unique:true, collation:{locale:'en',strenth:2},max: 50, trim: true},
    code : {type: String, required: true, unique:true, trim: true, sparse: true},
    description : {type: String, trim: true, required: false}, 
    status : {type: String, trim: true, required: false}, 
},
{
    timestamps:true
});

specializationSchema.plugin(mongoose_delete)
specializationSchema.plugin(mongooseAggregatePaginate);
specializationSchema.plugin(uniqueValidator);
mongoose.model('Specialization', specializationSchema);

module.exports = mongoose.model('Specialization');