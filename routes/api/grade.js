const express = require('express');
const router = express.Router();
const passport = require('passport');
//Load Input Validation
const Grade = require('../../models/grade');
const Student = require('../../models/student_enrollment');
const setting=require("../return_msg/setting");
const gradeValidation=require("../validation/grade");
let middleware = require('../../validation/middleware');

//@route GET api/university/register
//@desc Register route
//@access Public
router.post('/', middleware.checkToken, (req, res) => {

    // var result=middleware.function1("CAN_ADD_UNIVERSITIES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    console.log(req.body);

    var resultVali=gradeValidation.CheckValidation(req.body);
    if(!resultVali.status)
    {
        return res.send(resultVali);
    }

    const grade = new Grade({
        student_id: req.body.student_id,
        course_type: req.body.course_type,
        period_number:req.body.period_number,
        grades:req.body.grades,
       
    });

    grade.save()
        .then(university =>{
            return res.json(

                setting.status("Grade created",true,"created",university)
        
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


//@route  GET api/university/all
//@desc  Get all  university
//@access Public

router.get('/:id', middleware.checkToken, (req, res) => {

    //req.headers['authorization'];

    // var result=middleware.function1("CAN_VIEW_UNIVERSITIES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var ObjectId = require('mongodb').ObjectID;
    var id=req.params.id;

    var aggregate = Grade.aggregate();

    var page_no = req.param('page');

    aggregate.match({student_id:ObjectId(id)})
        .lookup({ from: "student_enrollments", localField: "student_id", foreignField: "_id",as: "student_doc"})
        .lookup({ from: "internships", localField: "student_doc._id", foreignField: "student_id",as: "internship_doc"});

    
    if(page_no==0)
    {
        return res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Grade.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
        if(err) 
        {
            console.log(err)
            return res.send(
    
                setting.status("Error",false,"error",err)

            );
        }
        else
        { 
        
            res.send(
        
                setting.status("Details'",true,"data found",{results})

            );
        
        }
    })       
})

//@route  GET api/university/id
//@desc  Get one  university
//@access Public
router.get('/:id', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_VIEW_UNIVERSITIES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    // var ObjectId = require('mongodb').ObjectID;
    // var id=req.params.id;
	
	// if(!ObjectId.isValid(id))
	// 	{
	// 		return res.send(
					
	// 			setting.status(validation.FALSE,false,"incorrect id",null)

	// 		 );
	// 	}
    // var aggregate = University.aggregate();

    // aggregate.match({"_id":ObjectId(id)})

    // let page_no=req.params.page;                

    // if(page_no==0)
    // {
    //     res.send(
        
    //         setting.status(validation.SHOW,false,"page No error",null)

    //     );
    // }

    // var options = { page : page_no, limit : 6}

    // University.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
    //     if(err) 
    //     {
    //         console.log(err)
    //         res.send(
    
    //             setting.status("Error",false,"error",err)

    //         );
    //     }
    //     else
    //     { 
        
    //         res.send(
        
    //             setting.status("Details'",true,"No data found",{results})

    //         );
        
    //     }
    // })       
})

// @route   DELETE api/university/:id
// @desc    Delete university
// @access  Private
router.delete('/:id', middleware.checkToken, (req, res) => {

    // var result=middleware.function1("CAN_DELETE_UNIVERSITIES");
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
        
      Grade.findById(req.params.id).then(university => {
            // Delete
            university.remove().then(() => { 
                res.json(
		
                    setting.status("Deleted",true,"deleted",null)
        
              )});
          })
          .catch(err =>{
            res.json(
		
                setting.status("Grade Not Found",false,"error",err)
        
              );
          })
        }    
  );

//@route GET api/university/universityupdate
//@desc Register route
//@access Public
router.post('/update',middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_EDIT_UNIVERSITIES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    // var result=gradeValidation.CheckValidation(req.body);
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var ObjectId = require('mongodb').ObjectID;

    let list=[];
    list=req.body.list;

    console.log("id",list[0].id)
    console.log(list.length)

    // semister
    // yearly
    // trimly

    var aggregate = Grade.aggregate();

    aggregate
    .lookup({ from: "student_enrollments", localField: "student_id", foreignField: "_id",as: "stu_doc"})
    //.lookup({ from: "internships", localField: "student_doc._id", foreignField: "student_id",as: "internship_doc"})
    .lookup({ from: "courses", localField: "stu_doc.course_id", foreignField: "_id",as: "course_doc"})
    .match({_id:ObjectId(list[0].id)})
    //.project({"course_doc":"$course_doc"});

    var options = { page : 1, limit : setting.pagecontent}

    Grade.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
        if(err) 
        {
            
            res.send(
    
                setting.status("Error",false,"error",err)

            );
        }
        else
        { 
        
            console.log(results)
            if(results.length>=0)
            {
                var marking=results[0].course_doc[0].marking_criteria;
                console.log(marking);
                

                if(marking==="percentage")
                {
                    console.log("wegfsljchkuweqjas")
                    for(let x=0;x<list.length;x++)
                    {
                        if(parseInt(list[x].grades)>100)
                        {
                            return res.send(
        
                                setting.status("Grade not valid",false,"percentage >100",null)
                
                            );
                        }
                    }

                }else if(marking==="cgpa")
                {
                    for(let x=0;x<list.length;x++)
                    {
                        if(parseInt(list[x].grades)>10)
                        {
                            return res.send(
        
                                setting.status("Grade not valid",false,"cgpa >10",null)
                
                            );
                        }
                    }

                }
            }

            
        
                for(let x=0;x<list.length;x++)
                {
            
                    console.log(list[x].id)
                    console.log(list[x].grades)

                    Grade.findByIdAndUpdate( list[x].id, {
                        grades:list[x].grades,        
                    }, {new: true})
                    .then(user => {
                        console.log(user)
                    }).catch(err => {
                           console.log(err);
                        
                    })

                }
            
            

            
            return res.send(
                    
                setting.status("Updated'",true,"Grade updated",null)
        
            );

        }
    })  


   
})

module.exports = router;