const express = require('express');
const router = express.Router();
//const passport = require('passport');
//Load Input Validation
const CCS_Association = require('../../models/ccs_association');
const Course_specialization = require('../../models/course_specification');
const setting=require("../return_msg/setting");
const ccsValidation=require("../validation/ccs_association");
let middleware = require('../../validation/middleware');

//@route GET api/college/
//@desc Register route
//@access Public
router.post('/', middleware.checkToken, (req, res) => {

    let course_id=req.body.course_id;
    let college_id=req.body.college_id;
    let specialisation_id=req.body.specialisation_id;

    CCS_Association.find({course_id:course_id,specialisation_id:specialisation_id,college_id:college_id})
        .then(result => {

            console.log(result.length);

            if(result.length!=0)
            {
                res.send(
    
                    setting.status("Some Specialization Already Exits",false,"details",null)
            
                );
            }

            else
            {
               
                // var result=ccsValidation.CheckValidation(req.body);
                // if(!result.status)
                // {
                //     return res.send(result);
                // }

                const newRole = new CCS_Association({
                    course_id: course_id,
                    college_id: college_id,
                    specialisation_id:specialisation_id
                    
                });
            
                newRole.save()
                    .then(role =>{
                        res.json(
            
                            setting.status("CCS created",true,"created",role)
                    
                        );
                    })
                    .catch(err => {
                       
                        res.json(
    
                            setting.status("Error",false,"name unique",err)
                    
                        );
                           
                    }); 
            }
        });  
    
    // CCS_Association.insertMany(req.body.list, function(err, result){
    //     if(err) res.send(
  
    //       setting.status("validation.NOT_FOUND",false,"ccs not created",err)
  
    //     );
    //     else res.send(
  
    //       setting.status("validation.AGENDA_CREATE",true,"ccs created",result)
  
    //     );
    // });
        
})

//get colege courses

//@route  GET api/college/
//@desc  Get all  college
//@access Public
router.get('/:college_id/courses',middleware.checkToken, (req, res) => {

    // var result=middleware.function1("CAN_EDIT_COLLEGE_COURE_SPECIALISATION_ASSOCIATION");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var aggregate = CCS_Association.aggregate();
    var ObjectId = require('mongodb').ObjectID;

    var page_no = req.param('page');
    var search = req.param('search');
    let college_id=req.params.college_id;
	console.log(college_id)


    aggregate.sort({"createdAt" : -1})
		.match({"college_id":ObjectId(college_id)})
		.lookup({ from: "colleges", localField: "college_id", foreignField: "_id",as: "college_doc"})
		.lookup({ from: "courses", localField: "course_id", foreignField: "_id",as: "course_doc"})
		.lookup({ from: "specializations", localField: "specialisation_id", foreignField: "_id",as: "specializations_doc"})
      
    if(search===null || search ===undefined)
    {
        
    }else
    {
        aggregate.match({"course_doc.name":{"$regex": search, "$options": "i"}});
    }

    
    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    CCS_Association.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
        if(err) 
        {
            
            res.send(
    
                setting.status("Error",false,"error",err)

            );
        }
        else
        {
		    
            res.send(
			
                setting.status("Details'",true,"No data found",{pages:pageCount,count:count,pagesize:setting.pagecontent,data:results})

            );
        
        }
    })       
})


router.get('/getall/course/:college_id/courses', (req, res) => {

    // var result=middleware.function1("CAN_EDIT_COLLEGE_COURE_SPECIALISATION_ASSOCIATION");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var aggregate = CCS_Association.aggregate();
    var ObjectId = require('mongodb').ObjectID;

    var page_no = req.param('page');
    var search = req.param('search');
    let college_id=req.params.college_id;
    console.log(college_id)

    aggregate.sort({"createdAt" : -1})
		.match({"college_id":ObjectId(college_id)})
		.lookup({ from: "colleges", localField: "college_id", foreignField: "_id",as: "college_doc"})
		.lookup({ from: "courses", localField: "course_id", foreignField: "_id",as: "course_doc"})
		.lookup({ from: "specializations", localField: "specialisation_id", foreignField: "_id",as: "specializations_doc"})
       .group({_id :"$course_doc._id","name": { "$first": "$course_doc.name"}})

    if(search===null || search ===undefined)
    {
        
    }else
    {

    
       //.project({_id:"$_id"})
        aggregate.match({"course_doc.name":{"$regex": search, "$options": "i"}});
    }

    
    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    CCS_Association.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
        if(err) 
        {
            
            res.send(
    
                setting.status("Error",false,"error",err)

            );
        }
        else
        {
		
		console.log(results[1])
		
		let courses=[];	
		
		for(let x=0;x<results.length;x++)
		{
			
			courses.push({_id:results[x]._id[0],name:results[x].name[0]})
		   
        }
		    
            res.send(
			
				{status:true,data:courses}
        
                //setting.status("Details'",true,"No data found",{pages:pageCount,count:count,pagesize:setting.pagecontent,data:courses})

            );
        
        }
    })       
})


router.get('/:course_id/specialization',middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_EDIT_COLLEGE_COURE_SPECIALISATION_ASSOCIATION");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var aggregate = Course_specialization.aggregate();
    var ObjectId = require('mongodb').ObjectID;

    var page_no = req.param('page');
    var search = req.param('search');
    let course_id=req.params.course_id;

    aggregate.sort({"createdAt" : -1})
		.match({"course_id":ObjectId(course_id)})
		.lookup({ from: "courses", localField: "course_id", foreignField: "_id",as: "course_doc"})
		.lookup({ from: "specializations", localField: "specialisation_id", foreignField: "_id",as: "specializations_doc"})
        //.match({"specializations_doc.deleted":false})
    if(search===null || search ===undefined)
    {
        
    }else
    {
        aggregate.match({"course_doc.name":{"$regex": search, "$options": "i"}});
    }

    
    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Course_specialization.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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


router.get('/:specialization_id/course', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_EDIT_COLLEGE_COURE_SPECIALISATION_ASSOCIATION");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    console.log("specialzationnnnnnnnnnnnnn")


    var aggregate = Course_specialization.aggregate();
    var ObjectId = require('mongodb').ObjectID;

    var page_no = req.param('page');
    var search = req.param('search');
    let specialization_id=req.params.specialization_id;

    console.log(specialization_id)


    aggregate
		.match({"specialisation_id":ObjectId(specialization_id)})
		.lookup({ from: "courses", localField: "course_id", foreignField: "_id",as: "course_doc"})
        .lookup({ from: "specializations", localField: "specialisation_id", foreignField: "_id",as: "specializations_doc"})
    if(search===null || search ===undefined)
    {
        
    }else
    {
        aggregate.match({"course_doc.name":{"$regex": search, "$options": "i"}});
    }

    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Course_specialization.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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



//***************************************************************************************************************** */
//*******************************get specialization in the college and course************************************** */
//**************************************************************************************************************** */

router.get('/college/:college_id/course/:course_id/specialization',(req, res) => {

    // var result=middleware.function1("CAN_EDIT_COLLEGE_COURE_SPECIALISATION_ASSOCIATION");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var aggregate = CCS_Association.aggregate();
    var ObjectId = require('mongodb').ObjectID;

    var page_no = req.param('page');
    var search = req.param('search');
    let course_id=req.params.course_id;
    let college_id=req.params.college_id;


    console.log(course_id)
    console.log(college_id);
    

    aggregate
        .match({"college_id":ObjectId(college_id)})
        .match({"course_id":ObjectId(course_id)})
		.lookup({ from: "specializations", localField: "specialisation_id", foreignField: "_id",as: "specializations_doc"})
        .match({"specializations_doc.status":"active"})
    if(search===null || search ===undefined)
    {
        
    }else
    {
        aggregate.match({"specializations_doc.name":{"$regex": search, "$options": "i"}});
    }

    
    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    CCS_Association.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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

// @route   DELETE api/college/:id
// @desc    Delete college
// @access  Private
router.delete(
    '/:college_id/courses/:course_id/:specialisation_id',
middleware.checkToken,    (req, res) => {

    // var result=middleware.function1("CAN_DELETE_COLLEGE_COURE_SPECIALISATION_ASSOCIATION");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var ObjectId = require('mongodb').ObjectID;
    var id=req.params.id;

    let course_id=req.params.course_id;
    let college_id=req.params.college_id;
    let specialisation_id=req.params.specialisation_id;
        
    CCS_Association.remove({"college_id":college_id,"course_id":course_id,"specialisation_id":specialisation_id})
    .exec()
    .then(() => {
            res.json(

                setting.status("CCS deleted",true,"Deleted",null)

            );
        })
    .catch(err => {
        console.log(err);
        res.json(

        setting.status("Error",false,"Error",err)

        );
    });
});


module.exports = router;
