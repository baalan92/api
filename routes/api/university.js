const express = require('express');
const router = express.Router();
const passport = require('passport');
//Load Input Validation
const University = require('../../models/university');
const setting=require("../return_msg/setting");
const uniValidation=require("../validation/university");
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

    var resultVali=uniValidation.CheckValidation(req.body);
    if(!resultVali.status)
    {
        return res.send(resultVali);
    }

    University.findOne({
            email: req.body.email
        })
        .then(university => {
            if (university) {
                res.json(
		
                    setting.status("University email already exits",false,"email already exits",null)
            
                  );
            } else {

                const newUniversity = new University({
                    name: req.body.name,
                    email: req.body.email,
                    contact_no:req.body.contact_no,
                    website:req.body.website,
                    description:req.body.description,
                    status:req.body.status,
                    year:req.body.year,
                    address:req.body.address
                });

                newUniversity.save()
                    .then(university =>{
                        res.json(
		
                            setting.status("university created",true,"created",university)
                    
                          );
                    })
                    .catch(err => {
                        if(err.errors.contact_no)
                        {
                            res.json(
		
                                setting.status("University contact number already exits",false,"contact number unique",null)
                        
                              );
                        }

                        if(err.errors.name)
                        {
                            res.json(
		
                                setting.status("University name already exits",false,"name unique",null)
                        
                            );
                        }

                        if(err.errors.email)
                        {
                            res.json(
		
                                setting.status("University email already exits",false,"email unique",null)
                        
                            );
                        }
                        
                    });
            }
        })
})


//@route  GET api/university/all
//@desc  Get all  university
//@access Public

router.get('/', middleware.checkToken, (req, res) => {

    //req.headers['authorization'];

    // var result=middleware.function1("CAN_VIEW_UNIVERSITIES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var aggregate = University.aggregate();

    var page_no = req.param('page');
    var search = req.param('search');
    var searchContact = req.param('searchContact');
    var searchEmail = req.param('searchEmail');
    var searchWesite = req.param('searchWesite');
    console.log(search)

    aggregate.sort({"createdAt" : -1})
    .match({status:"active"})

    if(search===null || search ===undefined)
    {
        
    }else
    {
        aggregate.match({"name":{"$regex": search, "$options": "i"}});
    }
	

	if(searchContact===null || searchContact ===undefined)
    {
        
    }
    else
    {
        aggregate.match({"contact_no":{"$regex": searchContact, "$options": "i"}});
    }
	
	if(searchEmail===null || searchEmail ===undefined)
    {
        
    }
    else
    {
        aggregate.match({"email":{"$regex": searchEmail, "$options": "i"}});
    }

    if(searchWesite===null || searchWesite ===undefined)
    {
        
    }
    else
    {
        aggregate.match({"website":{"$regex": searchWesite, "$options": "i"}});
    }
    
    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    University.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
        if(err) 
        {
            console.log(err)
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

//@route  GET api/university/id
//@desc  Get one  university
//@access Public
router.get('/:id', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_VIEW_UNIVERSITIES");
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
    var aggregate = University.aggregate();

    aggregate.match({"_id":ObjectId(id)});

    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : 6}

    University.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
        if(err) 
        {
            console.log(err)
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

// @route   DELETE api/university/:id
// @desc    Delete university
// @access  Private
router.delete('/:id', middleware.checkToken, (req, res) => {

    // var result=middleware.function1("CAN_DELETE_UNIVERSITIES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }
    

    console.log("sampleeeeeeeeeee")
    var ObjectId = require('mongodb').ObjectID;
    var id=req.params.id;
    
    if(!ObjectId.isValid(id))
        {
            return res.send(
                    
                setting.status(validation.FALSE,false,"incorrect id",null)

                );
        }
        
        University.findByIdAndUpdate(id, {
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

//@route GET api/university/universityupdate
//@desc Register route
//@access Public
router.post('/:id',middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_EDIT_UNIVERSITIES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var result=uniValidation.CheckValidation(req.body);
    if(!result.status)
    {
        return res.send(result);
    }

    var ObjectId = require('mongodb').ObjectID;

	if(!ObjectId.isValid(req.params.id))
        {
            return res.send(
                        
                setting.status("ID wrong",false,"object id wrong",null)

            );
        }

    const id = req.params.id;

    University.findOne({
            _id: id
        })
        .then(university => {
            if (university) {
                
                University.findOneAndUpdate(
                    { _id : id },
                    {$set:{name: req.body.name,email: req.body.email,contact_no:req.body.contact_no,
                        website:req.body.website,description:req.body.description,status:req.body.status,
                        year:req.body.year,address:req.body.address}},
                    {runValidators: true, context: 'query' })
                   // {_id:id}}
                  .then(university =>{
                    res.json(
		
                        setting.status("University Updated",true,"updated",university)
                
                      );
                  })
                  .catch(err =>{
                    if(err.errors.contact_no)
                        {
                            res.json(
		
                                setting.status("University contact number already exits",false,"contact number unique",null)
                        
                              );
                        }

                        if(err.errors.name)
                        {
                            res.json(
		
                                setting.status("University name already exits",false,"name unique",null)
                        
                            );
                        }

                        if(err.errors.email)
                        {
                            res.json(
		
                                setting.status("University email already exits",false,"email unique",null)
                        
                            );
                        }
                  });
            } else {
                res.json(
		
                    setting.status("University Not Found",false,"error",err)
            
                  );
            }
        })
})

module.exports = router;