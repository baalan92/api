var mongoose = require('mongoose'); 
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate'); 
var bcrypt = require('bcryptjs');
var mongoose_delete=require('mongoose-delete')


var studentEnrollmentSchema = new mongoose.Schema(
{
    fname : {type: String, required: true, max: 25, trim: true},
    lname : {type: String, required: true, max: 25, trim: true},
    email : {type: String, required: true, lowercase: true, unique:true, trim: true, sparse: true},
    contact_no : {type: String, required: true, min: 13, max : 13},
    college_id : {type:mongoose.Schema.Types.ObjectId, ref : 'College', required: true }, 
    course_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Course', required: true }, 
    payment_status : {type:String, required: true ,default:"not_paid"},
    password : {type:String, required: true },
    role : {type:mongoose.Schema.Types.ObjectId, ref : 'Role', required: true },
    is_password_defalut:{type:Boolean, required: true, default:true },
    age : {type:String, required: false },
    gender : {type:String, required: false },
    current_address : {type:String, required: false },
    permanant_address : {type:String, required: false },
    project : {type:String, required: false },
    specific_academic_achivement : {type:String, required: false },
    academic_from : {type:String, required: false },
    academic_to : {type:String, required: false },
    writen_introduction_question : {type:String, required: false },
    writen_introduction_answer : {type:String, required: false },
    video : {type:String, required: false },
    written_test_result : {type:String, required: false,default:"0" },
    attachment : {type:String, required: false },
    is_worked : {type:Boolean, required: false },
    specialization_id_major : {type:mongoose.Schema.Types.ObjectId, ref : 'Specialization', required: true }, 
    specialization_id_minor : {type:mongoose.Schema.Types.ObjectId, ref : 'Specialization', required: false }, 
    c_state : {type:String, required: false },
    c_city : {type:String, required: false },
    c_pin_code : {type:String, required: false },
    p_state : {type:String, required: false },
    p_city : {type:String, required: false },
    p_pin_code : {type:String, required: false },
    writen_introduction : {type:String, required: false },
    overall_grade : {type:String, required: false },
    status:{type:String, required: false,default:"active"},
    is_submited:{type:Boolean, required: false,default:false},
    is_approved:{type:Boolean, required: false,default:false}
},
{
    timestamps:true
});

studentEnrollmentSchema.methods.comparePassword = function(candidatePassword, callback)
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

studentEnrollmentSchema.plugin(mongoose_delete)
studentEnrollmentSchema.plugin(mongooseAggregatePaginate);
mongoose.model('Student_Enrollment', studentEnrollmentSchema);

module.exports = mongoose.model('Student_Enrollment');