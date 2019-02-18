var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var mongoose_delete=require('mongoose-delete')

// Here we create a schema called User with the following fields.
var userSchema = new mongoose.Schema(
{
    fname : {type: String, required: true, max: 25, trim: false},
    lname : {type: String, required: true, max: 25, trim: false},
    email : {type: String, required: true, lowercase: true, unique:true, trim: true, sparse: true},
    password: {type: String, required: true, min: 6},
    avatar: {type: String, required: false},
    registered_date : {type: Date, default: Date.now},
    contact_no : {type: String, required: true, unique:true, min: 13, max : 13},
    role:{type:mongoose.Schema.Types.ObjectId, ref : 'Role', required: true}, // 1: admin, 2: host, 3: user 
    description : {type: String, required: false, trim: false}, 
    is_deleted:{type: Boolean, default:false},  // 0 : No, 1 : Yes
    status : {type: String, required: false, trim: false,default:"active"}, 
},
{
    timestamps:true
});

// // This middleware compares user's typed-in password during login with the password stored in database
userSchema.methods.comparePassword = function(candidatePassword, callback)
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

// After we create a schema, the next step is to create a model based on that schema.
// A model is a class with which we construct documents.
// In this case, each document will be a user with properties and behaviors as declared in our schema.

userSchema.plugin(mongoose_delete)
mongoose.model('User', userSchema);
module.exports = mongoose.model('User');