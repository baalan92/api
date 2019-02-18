var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var uniqueValidator = require('mongoose-unique-validator');
var mongoose_delete=require('mongoose-delete')


var collegeSchema = new mongoose.Schema(
{
    name : {type: String, required: true, max: 25, trim: true},
    email : {type: String, required: true, lowercase: true, unique:true, trim: true, sparse: true},
    contact_no : {type: String, required: true,unique:true, min: 13, max : 13},
    website : {type: String, trim: true}, 
    address : {type: String, required: true, max: 25, trim: true},
    state : {type: String, required: true, max: 25, trim: true},
    city : {type: String, required: true, max: 25, trim: true},
    pin_code : {type: String, required: true, max: 6, min: 6, trim: true},
    hr_name : {type: String, required: true, max: 25, trim: true},
	hr_email : {type: String, required: true,unique:true, lowercase: true, trim: true, sparse: true},
    hr_contact_no : {type: String, required: true,unique:true,min: 13, max : 13},
    password : {type: String, trim: true, required: false},
    status : {type: String, trim: true, required: false,default:"active"},
    role : {type:mongoose.Schema.Types.ObjectId, ref : 'Role', required: true }, 
    is_password_defalut:{type:Boolean, required: true, default:true },
    description : {type: String, required: false, max: 25, trim: true},
    industry : {type: String, required: false, max: 25, trim: true},
    locations : {type: String, required: false, max: 25, trim: true},

},
{
    timestamps:true
});

collegeSchema.methods.comparePassword = function(candidatePassword, callback)
{
  'use strict';
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch)
  {
      if (err)
      {
        return callback(err);
      }
      callback(null, isMatch);
  });
};

collegeSchema.plugin(mongoose_delete)
collegeSchema.plugin(mongooseAggregatePaginate);
collegeSchema.plugin(uniqueValidator);
mongoose.model('Employer', collegeSchema);

module.exports = mongoose.model('Employer');