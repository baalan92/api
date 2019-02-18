const express = require('express');
const router = express.Router();
//const passport = require('passport');
//Load Input Validation
const Internship = require('../../models/internship_details');
const Course_specialization = require('../../models/course_specification');
const setting=require("../return_msg/setting");
const InternValidation=require("../validation/internship_details");
let middleware = require('../../validation/middleware');

//@route GET api/course/
//@desc Register route
//@access Public
router.post('/', middleware.checkToken,(req, res) => {
    console.log(req.body);

    var result=InternValidation.CheckValidation(req.body);
    if(!result.status)
    {
        return res.send(result);
    }

        const newCourse = new Internship({
            student_id: req.body.student_id,
            internship_details : req.body.internship_details,
            employer : req.body.employer,
            project_summary : req.body.project_summary,
            internship_duration : req.body.internship_duration,
        });

            newCourse.save()
        .then(async university =>{
            return res.json(

                setting.status("Internship created",true,"created",university)
        
                );
        })
        .catch(err => {
            if(err)
            {
                
                res.json(

                    setting.status("Error",false,"error",err)
            
                    );
                                 
            }
            
        });     
})

// @route   DELETE api/course/:id
// @desc    Delete course
// @access  Private
router.delete(
    '/:id',
middleware.checkToken,    (req, res) => {
    // var result=middleware.function1("CAN_DELETE_COURSES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }


    var ObjectId = require('mongodb').ObjectID;
    var id=req.params.id;
	
	if(!ObjectId.isValid(id))
		{
			return res.send(
					
				setting.status(validation.FALSE,false,"incorrect id",null)

			 );
        }
        
        Internship.findById(id).then(course => {
            // Delete
            course.remove().then(() => { 
                res.json(
		
                    setting.status("Deleted",true,"deleted",null)
        
              )});
          })
          .catch(err =>{
            res.json(
		
                setting.status("Course Not Found",false,"error",err)
        
              );
          })
        }    
  );

//@route GET api/course/:id
//@desc Register route
//@access Public
router.post('/:id', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_EDIT_COURSES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var resultVali=InternValidation.CheckValidation(req.body);
    if(!resultVali.status)
    {
        return res.send(resultVali);
    }
    
    var ObjectId = require('mongodb').ObjectID;
    var id=req.params.id;
	
	if(!ObjectId.isValid(id))
		{
			return res.send(
					
				setting.status(validation.FALSE,false,"incorrect id",null)

			 );
		}

    Internship.findOne({
            _id: id
        })
        .then(course => {
            if (course) {
                Internship.findOneAndUpdate(
                    { _id : id },
                    {$set:{
                    internship_details : req.body.internship_details,
                    employer : req.body.employer,
                    project_summary : req.body.project_summary,
                    internship_duration : req.body.internship_duration}},
                    {runValidators: true, context: 'query' })
                  .then(course =>{
                    res.json(
		
                        setting.status("Internship Updated",true,"updated",course)
                
                      );
                  })
                  .catch(err =>{
                    if(err)
                        {
                            res.json(
		
                                setting.status("Error",false,"error",err)
                        
                              );
                        }

                  });
            } else {
                res.json(
		
                    setting.status("Internship details Not Found",false,"error",err)
            
                  );
            }
        })
})

module.exports = router;