var mongoose = require('mongoose');  

var collegeCourseSplSchema = new mongoose.Schema(
{
    college_id : {type:mongoose.Schema.Types.ObjectId, ref : 'College', required: true }, 
    course_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Course', required: true },
    specialization_id : {type:mongoose.Schema.Types.ObjectId, ref : 'Specialization', required: true },
    description : {type: String, trim: true, required: false} 
},
{
    timestamps:true
});

mongoose.model('College_Course_Spl', collegeCourseSplSchema);

module.exports = mongoose.model('College_Course_Spl');