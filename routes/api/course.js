const express = require('express');
const router = express.Router();
//const passport = require('passport');
//Load Input Validation
const Course = require('../../models/course');
const Course_specialization = require('../../models/course_specification');
const setting=require("../return_msg/setting");
const courseValidation=require("../validation/course");
let middleware = require('../../validation/middleware');

//@route GET api/course/
//@desc Register route
//@access Public
router.post('/', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_ADD_COURSES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    console.log(req.body);

    var result=courseValidation.CheckValidation(req.body);
    if(!result.status)
    {
        return res.send(result);
    }

    Course.findOne({
            code: req.body.code
        })
        .then(course => {
            if (course) {
                res.json(
		
                    setting.status("Course code already exits",false,"code already exits",null)
            
                  );
            } else {


                const newCourse = new Course({
                    name: req.body.name,
                    code: req.body.code,
                    duration:req.body.duration,
                    marking_criteria:req.body.marking_criteria,
                    academic_term:req.body.academic_term,
                    description:req.body.description,
                    status:req.body.status
                });

                 newCourse.save()
                .then(async university =>{

                    let list=[];
                    list=req.body.list;
            
                    await save_courseSpecialization(list,university._id);

                    return res.json(

                        setting.status("Course created",true,"created",university)
                
                        );
                })
                .catch(err => {
                    if(err)
                    {
                        if(err.errors.name)
                            {
                                res.json(
            
                                    setting.status("Course Name must be unique",false,"name unique",err)
                            
                                    );
                            }              
                    }
                    
                });
           
            }
        })
})

async function save_courseSpecialization(list,id)
{
    console.log(list)
    for(let x=0;x<list.length;x++)
        {
            const newRole = new Course_specialization({
                course_id:id,
                specialisation_id: list[x],
                
            });
        
            await newRole.save()
        }
}

router.get('/getall/full', (req, res) => {
Course.find({role_id:req.params.id,status:"active"})
        .then(result => {
            res.send(
  
                setting.status("Show all",true,"details",result)
        
              );
        });
      
})	


//@route  GET api/course/
//@desc  Get all  course
//@access Public
router.get('/', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_VIEW_COURSES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }   


    var aggregate = Course.aggregate();

    var page_no = req.param('page');
    var search = req.param('search');
    var searchCode = req.param('searchCode');
    var searchMarkingCriteria = req.param('searchMarkingCriteria');
    var searchAcademicTerm = req.param('searchAcademicTerm');

    console.log("searchMarkingCriteria",searchMarkingCriteria)

    aggregate.sort({"createdAt" : -1})
    .lookup({ from: "course_specializations", localField: "_id", foreignField: "course_id",as: "specialization_doc"})
    .match({status:"active"})
      

    if(search===null || search ===undefined)
    {
        
    }else
    {
        aggregate.match({"name":{"$regex": search, "$options": "i"}});
    }

    if(searchCode===null || searchCode ===undefined)
    {
        
    }else
    {
        aggregate.match({"code":{"$regex": searchCode, "$options": "i"}});
    }

    if(searchMarkingCriteria===null || searchMarkingCriteria ===undefined)
    {
        
    }else
    {
        if(searchMarkingCriteria.length>0)
        {
            let y=[];

            for(let x=0;x<searchMarkingCriteria.length;x++)
            {
                y.push({"marking_criteria":searchMarkingCriteria[x]});
            }

            console.log("y",y)

            aggregate.match({$or:y});
        }      
    }

    if(searchAcademicTerm===null || searchAcademicTerm ===undefined)
    {
        
    }else
    {
        if(searchAcademicTerm.length>0)
        {
            let y=[];

            for(let x=0;x<searchAcademicTerm.length;x++)
            {
                y.push({"academic_term":searchAcademicTerm[x]});
            }

            console.log("y",y)

            aggregate.match({$or:y});
        }
    }
	
    
    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Course.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
        if(err) 
        {
            
            res.send(
    
                setting.status("Error",false,"error",err)

            );
        }
        else
        { 
        
            res.send(
        
                setting.status("Details'",true,"No data found",{pages:pageCount,count:count,pagesize:setting.pagecontent,results})

            );
        
        }
    })       
})

//@route  GET api/course/id
//@desc  Get one  course
//@access Public
router.get('/:id', middleware.checkToken, (req, res) => {

    // var result=middleware.function1("CAN_VIEW_COURSES");
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
        
    var aggregate = Course.aggregate();

    aggregate.match({"_id":ObjectId(id)})
    .lookup({ from: "course_specializations", localField: "_id", foreignField: "course_id",as: "cs_doc"})
    .lookup({ from: "specializations", localField: "cs_doc.specialisation_id", foreignField: "_id",as: "specialization_doc"})
    .project({"cs_doc":0})
    .match({status:"active"})
               

    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : 6}

    Course.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
        if(err) 
        {
            res.send(
    
                setting.status("Error",false,"error",err)

            );
        }
        else
        { 
        
            res.send(
        
                setting.status("Details'",true,"No data found",{results})

            );
        
        }
    })       
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
        
        Course.findByIdAndUpdate(id, {
            status: "deactive",
            }, {new: true})

            .then(user => {
                res.json(setting.status("Deleted", true, "deleted", null));
            })
            .catch(err => {
                res.json(setting.status("Error", false, "error", err));
            });
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

    var resultVali=courseValidation.CheckValidation(req.body);
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
        
        Course_specialization.remove({course_id:id})
        .exec()
        .then(() => {
            console.log("deleted");
            })
        .catch(err => {
            console.log(err);
           
        }); 

    Course.findOne({
            _id: id
        })
        .then(course => {
            if (course) {
                Course.findOneAndUpdate(
                    { _id : id },
                    {$set:{
                    name: req.body.name,
                    code: req.body.code,
                    duration:req.body.duration,
                    marking_criteria:req.body.marking_criteria,
                    academic_term:req.body.academic_term,
                    description:req.body.description,
                    status:req.body.status}},
                    {runValidators: true, context: 'query' })
                  .then(course =>{

                    let list=[];
                    list=req.body.list;

                    save_courseSpecialization(list,id);

                    res.json(
		
                        setting.status("Course Updated",true,"updated",course)
                
                      );
                  })
                  .catch(err =>{
                    if(err.errors.name)
                        {
                            res.json(
		
                                setting.status("Course name already exits",false,"name unique",null)
                        
                              );
                        }

                        if(err.errors.code)
                        {
                            res.json(
		
                                setting.status("Course code already exits",false,"name unique",null)
                        
                              );
                        }
                  });
            } else {
                res.json(
		
                    setting.status("Course Not Found",false,"error",err)
            
                  );
            }
        })
})

module.exports = router;