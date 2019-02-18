const express = require('express');
const router = express.Router();
//const passport = require('passport');
//Load Input Validation
const College = require('../../models/college');
const setting=require("../return_msg/setting");
const collegeValidation=require("../validation/college");
let middleware = require('../../validation/middleware');

//@route GET api/college/
//@desc Register route
//@access Public
router.post('/', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_ADD_COLLEGES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    console.log(req.body);

    var result=collegeValidation.CheckValidation(req.body);
    if(!result.status)
    {
        return res.send(result);
    }

        College.findOne({
            email: req.body.email
        })
        .then(college => {
            if (college) {
                res.json(
		
                    setting.status("College email already exits",false,"email already exits",null)
            
                  );
            } else {

                const newCollege = new College({
                    name: req.body.name,
                    email: req.body.email,
                    contact_no:req.body.contact_no,
                    college_code:req.body.college_code,
                    year:req.body.year,
                    website:req.body.website,
                    university_id:req.body.university_id,
                    address:req.body.address,
                    state: req.body.state,
                    city: req.body.city,
                    pin_code:req.body.pin_code,
                    geolocation:req.body.geolocation,
                    total_student:req.body.total_student,
                    palcement_head_name:req.body.palcement_head_name,
                    placement_head_email: req.body.placement_head_email,
                    placement_head_contact_no: req.body.placement_head_contact_no,
                    status:req.body.status
                });

                newCollege.save()
                    .then(college =>{
                        res.json(
		
                            setting.status("college created",true,"created",college)
                    
                          );
                    })
                    .catch(err => {
                        if(err.errors.name)
                        {
                            res.json(
		
                                setting.status("College name already exits",false,"name unique",null)
                        
                              );
                        }

                        if(err.errors.email)
                        {
                            res.json(
		
                                setting.status("College email already exits",false,"email unique",null)
                        
                              );
                        }

                        if(err.errors.contact_no)
                        {
                            res.json(
		
                                setting.status("College contact number already exits",false,"contact_no unique",null)
                        
                              );
                        }

                        if(err.errors.placement_head_email)
                        {
                            res.json(
		
                                setting.status("College placement head email already exits",false,"placement_head_email unique",null)
                        
                              );
                        }

                        if(err.errors.placement_head_contact_no)
                        {
                            res.json(
		
                                setting.status("College placement head contact number already exits",false,"placement_head_contact_no unique",null)
                        
                              );
                        }
                    });
            }
        })
})

router.get('/getall/full', (req, res) => {
    var aggregate = College.aggregate();

    var page_no = req.param('page');
    var search = req.param('search');
	

    aggregate.sort({"createdAt" : -1})
    .match({status:"active"})
           
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

    College.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
        if(err) 
        {
            
            res.send(
    
                setting.status("Error",false,"error",err)

            );
        }
        else
        { 
        
            res.send(
        
                {data:results}

            );
        
        }
    })   
      
})		


//@route  GET api/college/
//@desc  Get all  college
//@access Public
router.get('/', middleware.checkToken, (req, res) => {

    // var result=middleware.function1("CAN_VIEW_COLLEGES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }


    var aggregate = College.aggregate();

    var page_no = req.param('page');
    var search = req.param('search');
	 var searchEmail = req.param('searchEmail');
	 var searchContact = req.param('searchContact');
	 var searchUni = req.param('searchUni');


    aggregate.sort({"createdAt" : -1})
            .lookup({ from: "universities", localField: "university_id", foreignField: "_id",as: "university_doc"})
            .match({status:"active"})

    if(search===null || search ===undefined)
    {
        
    }else
    {
        aggregate.match({"name":{"$regex": search, "$options": "i"}});
    }
	
	if(searchEmail===null || searchEmail ===undefined)
    {
        
    }else
    {
        aggregate.match({"email":{"$regex": searchEmail, "$options": "i"}});
    }
	
	if(searchContact===null || searchContact ===undefined)
    {
        
    }else
    {
        aggregate.match({"contact_no":{"$regex": searchContact, "$options": "i"}});
    }
	
	if(searchUni===null || searchUni ===undefined)
    {
        
    }else
    {
        // if(searchUni.length>0)
        // {
        //     let y=[];

        //     for(let x=0;x<searchUni.length;x++)
        //     {
        //         y.push({"university_doc.name":ObjectId(searchUni[x])})
        //     }

        //     aggregate.match({$or:y});
        // }

        aggregate.match({"university_doc.name":{"$regex": searchUni, "$options": "i"}});
    }
    
    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    College.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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

//@route  GET api/college/id
//@desc  Get one  college
//@access Public
router.get('/:id', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_VIEW_COLLEGES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }


    var ObjectId = require('mongodb').ObjectID;
    var id=req.params.id;
	
	if(!ObjectId.isValid(id))
		{
			return res.send(
					
				setting.status("Incorrect ID",false,"incorrect id",null)

			 );
        }
        
    var aggregate = College.aggregate();

    aggregate.match({"_id":ObjectId(id)})
            .lookup({ from: "universities", localField: "university_id", foreignField: "_id",as: "university_doc"})
            .match({status:"active"})


    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status("Page error",false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : 6}

    College.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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

// @route   DELETE api/college/:id
// @desc    Delete college
// @access  Private
router.delete(
    '/:id',
middleware.checkToken,    (req, res) => {

    // var result=middleware.function1("CAN_DELETE_COLLEGES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var ObjectId = require('mongodb').ObjectID;
    var id=req.params.id;
	
	if(!ObjectId.isValid(id))
		{
			return res.send(
					
				setting.status("Incorrect ID",false,"incorrect id",null)

			 );
        }
        
        College.findByIdAndUpdate(id, {
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

//@route GET api/college/:id
//@desc Register route
//@access Public
router.post('/:id', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_EDIT_COLLEGES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }


    var resultVali=collegeValidation.CheckValidation(req.body);
    if(!resultVali.status)
    {
        return res.send(resultVali);
    }
    
    var ObjectId = require('mongodb').ObjectID;
    var id=req.params.id;
	
	if(!ObjectId.isValid(id))
		{
			return res.send(
					
				setting.status("Incorrect ID",false,"incorrect id",null)

			 );
		}

    College.findOne({
            _id: id
        })
        .then(college => {
            if (college) {
                College.findOneAndUpdate(
                    { _id : id },
                    {$set:{
                    name: req.body.name,
                    email: req.body.email,
                    contact_no:req.body.contact_no,
                    college_code:req.body.college_code,
                    year:req.body.year,
                    website:req.body.website,
                    university_id:req.body.university_id,
                    address:req.body.address,
                    state: req.body.state,
                    city: req.body.city,
                    pin_code:req.body.pin_code,
                    geolocation:req.body.geolocation,
                    total_student:req.body.total_student,
                    palcement_head_name:req.body.palcement_head_name,
                    placement_head_email: req.body.placement_head_email,
                    placement_head_contact_no: req.body.placement_head_contact_no,
                    status:req.body.status}},
                    {runValidators: true, context: 'query' })
                  .then(college =>{
                    res.json(
		
                        setting.status("College Updated",true,"updated",college)
                
                      );
                  })
                  .catch(err =>{
                    if(err.errors.name)
                        {
                            res.json(
		
                                setting.status("College name already exits",false,"name unique",null)
                        
                              );
                        }

                        if(err.errors.email)
                        {
                            res.json(
		
                                setting.status("College email already exits",false,"email unique",null)
                        
                              );
                        }

                        if(err.errors.contact_no)
                        {
                            res.json(
		
                                setting.status("College contact number already exits",false,"contact_no unique",null)
                        
                              );
                        }

                        if(err.errors.placement_head_email)
                        {
                            res.json(
		
                                setting.status("College placement head email already exits",false,"placement_head_email unique",null)
                        
                              );
                        }

                        if(err.errors.placement_head_contact_no)
                        {
                            res.json(
		
                                setting.status("College placement head contact number already exits",false,"placement_head_contact_no unique",null)
                        
                              );
                        }
                  });
            } else {
                res.json(
		
                    setting.status("College Not Found",false,"error",err)
            
                  );
            }
        })
})

module.exports = router;