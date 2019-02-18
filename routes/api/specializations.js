const express = require('express');
const router = express.Router();
//const passport = require('passport');
//Load Input Validation
const Specializations = require('../../models/specializations');
const setting=require("../return_msg/setting");
const specializationsValidation=require("../validation/specializations");
let middleware = require('../../validation/middleware');

//@route GET api/course/
//@desc Register route
//@access Public
router.post('/', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_ADD_SPECIALIZATIONS");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var resultVali=specializationsValidation.CheckValidation(req.body);
    if(!resultVali.status)
    {
        return res.send(resultVali);
    }

    Specializations.findOne({
            code: req.body.code
        })
        .then(specializations => {
            if (specializations) {
                res.json(
		
                    setting.status("Code already exits",false,"code already exits",null)
            
                  );
            } else {

                const newSpecializations = new Specializations({
                    name: req.body.name,
                    code: req.body.code,
                    description:req.body.description,
                    status:req.body.status
                });

                newSpecializations.save()
                    .then(specializations =>{
                        res.json(
		
                            setting.status("Specializations created",true,"created",specializations)
                    
                          );
                    })
                    .catch(err => {
                        if(err.errors.name)
                        {
                            res.json(
		
                                setting.status("Specialization name already exits",false,"name unique",null)
                        
                              );
                        }

                        if(err.errors.code)
                        {
                            res.json(
        
                                setting.status("Specialization code already exits",false,"code unique",null)
                        
                            );
                        }
                    });
            }
        })
})

router.get('/getall/specalization',(req, res) => {


    var aggregate = Specializations.aggregate();

    var page_no = req.param('page');
    var search = req.param('search');

    aggregate.sort({"createdAt" : -1})            
    //.match({"deleted":false})


    if(search===null || search ===undefined)
    {
        
    }else
    {
        aggregate.match({"name":{"$regex": search, "$options": "i"}});
    }
    
    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Specializations.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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



//@route  GET api/course/
//@desc  Get all  course
//@access Public
router.get('/', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_VIEW_SPECIALIZATIONS");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }


    var aggregate = Specializations.aggregate();

    var page_no = req.param('page');
    var search = req.param('search');
    var searchCode = req.param('searchCode');

    aggregate.sort({"createdAt" : -1})
    //.match({"deleted":false})


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
    
    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Specializations.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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
router.get('/:id', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_VIEW_SPECIALIZATIONS");
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
    var aggregate = Specializations.aggregate();

    aggregate.match({"_id":ObjectId(id)})
    .lookup({ from: "course_specializations", localField: "_id", foreignField: "specialisation_id",as: "ccs_doc"})
    .lookup({ from: "courses", localField: "ccs_doc.course_id", foreignField: "_id",as: "course_doc"})
    .project({"ccs_doc":0})
    .project({_id:"$_id",name:"$name",code:"$code",description:"$description",status:"$status",course_doc:"$course_doc.name"})

    //.match({"deleted":false})



    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : 6}

    Specializations.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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
router.delete('/:id', middleware.checkToken,
    (req, res) => {

    // var result=middleware.function1("CAN_DELETE_SPECIALIZATIONS");
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
        
        Specializations.findById(id).then(specializations => {
            // Delete
            specializations.remove().then(() => { 
                res.json(
		
                    setting.status("Deleted",true,"deleted",null)
        
              )});
          })
          .catch(err =>{
            res.json(
		
                setting.status("Specializations Not Found",false,"error",err)
        
              );
          })
        }    
  );

//@route GET api/course/:id
//@desc Register route
//@access Public
router.post('/:id', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_EDIT_SPECIALIZATIONS");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var resultVali=specializationsValidation.CheckValidation(req.body);
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

    Specializations.findOne({
            _id: id
        })
        .then(specializations => {
            if (specializations) {
                Specializations.findByIdAndUpdate(id, {
                    name: req.body.name,
                    code: req.body.code,
                    description:req.body.description,
                    status:req.body.status
                    }, {new: true})
                  .then(specializations =>{
                    res.json(
		
                        setting.status("Specializations Updated",true,"updated",specializations)
                
                      );
                  })
                  .catch(err =>{
                    if(err.errors.name)
                    {
                        res.json(
    
                            setting.status("Specialization name already exits",false,"name unique",null)
                    
                          );
                    }

                    if(err.errors.code)
                    {
                        res.json(
    
                            setting.status("Specialization code already exits",false,"code unique",null)
                    
                          );
                    }

                  });
            } else {
                res.json(
		
                    setting.status("Specializations Not Found",false,"error",err)
            
                  );
            }
        })
})

module.exports = router;