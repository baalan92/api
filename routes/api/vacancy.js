const express = require('express');
const router = express.Router();
const passport = require('passport');
//Load Input Validation
const Vacancy = require('../../models/vacancy');
const Suggestion = require('../../models/suggestion');
const Vacancy_specialization = require('../../models/vacancy_specializations');
const Vacancy_Course = require('../../models/vacancy_course');

const Student = require('../../models/student_enrollment');
const setting=require("../return_msg/setting");
const vacancyValidation=require("../validation/vacancy");
let middleware = require('../../validation/middleware');
const CCS_Associations = require('../../models/ccs_association');
const arrayUniq = require('array-uniq');

var sendMail=require("../return_msg/sendMail");
const Offer = require('../../models/offer');

const Employer = require('../../models/employer');
const Invite = require('../../models/invite');

//@route GET api/university/register
//@desc Register route
//@access Public
router.post('/', middleware.checkToken, (req, res) => {

    // var result=middleware.function1("CAN_ADD_UNIVERSITIES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var resultVali=vacancyValidation.CheckValidation(req.body);
    if(!resultVali.status)
    {
        return res.send(resultVali);
    }

    var idd=middleware.get_id();

    const newVacancy = new Vacancy({
        job_title: req.body.job_title,
        number: req.body.number,
        description:req.body.description,
        closing_date:req.body.closing_date,
        status:"active",
        date_from : req.body.date_from,
        date_to : req.body.date_to,
        venue : req.body.venue,
        job_location: req.body.job_location,
        job_start_date: req.body.job_start_date,
        desired_skills: req.body.desired_skills,
        desired_educational_qualification: req.body.desired_educational_qualification,
        minimum_percentage: req.body.minimum_percentage,
        minimum_grade: req.body.minimum_grade,
        minimum_cgpa: req.body.minimum_cgpa,
        employer_id:idd,
    });

    newVacancy.save()
        .then(async university =>{

            let list=[];
            let courseList=[];
            list=req.body.list;
            courseList=req.body.courseList;

            await save_vacancySpecialization(list,university._id);
            await save_vacancyCourse(courseList,university._id);
            await suggestion(list,university._id);

             res.json(

                    setting.status("Vacancy created",true,"created",await university)
        
            );
        })
        .catch(err => {
           
            return res.json(

                setting.status("Error",false,"error",err)
        
            );
            
        }); 
})

async function save_vacancyCourse (list,id)
{
    for(let x=0;x<list.length;x++)
        {
            const newRole = new Vacancy_Course({
                vacancy_id:id,
                course_id: list[x],
                
            });
        
            await newRole.save()
        }
}

async function save_vacancySpecialization(list,id)
{
    for(let x=0;x<list.length;x++)
        {
            const newRole = new Vacancy_specialization({
                vacancy_id:id,
                specialization_id: list[x],
                
            });
        
            await newRole.save()
        }
}


async function suggestion(list,vacancy_id)
{
    // var result=middleware.function1("CAN_VIEW_UNIVERSITIES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }  

    var ObjectId = require('mongodb').ObjectID;
	
	if(!ObjectId.isValid(vacancy_id))
		{
			return res.send(
					
				setting.status("Incorrect ID",false,"incorrect id",null)

			 );
		}
   // var aggregate = Vacancy.aggregate();
   //var aggregate = Student.aggregate();

  // aggregate.match({"_id":ObjectId(id)})

//    aggregate.match({"_id":ObjectId(id)})
//    .lookup({ from: "vacancy_specializations", localField: "_id", foreignField: "vacancy_id",as: "vacancy_spec_doc"})
//    .lookup({ from: "ccs_associations", localField: "vacancy_spec_doc.specialization_id", foreignField: "specialisation_id",as: "spec_doc"})
//    .lookup({ from: "student_enrollments", localField: "spec_doc.course_id", foreignField: "course_id",as: "student_doc"})
//    .project({vacancy_spec_doc:0})
//    .project({spec_doc:0})
  // .project({students:"$student_doc"});

//finalllllllll
    //  aggregate//.match({"_id":ObjectId(id)})
    //  .lookup({ from: "ccs_associations", localField: "course_id", foreignField: "course_id",as: "ccs_doc"})
    //  .lookup({ from: "vacancy_specializations", localField: "ccs_doc.specialisation_id", foreignField: "specialization_id",as: "vacancy_spec_doc"})
    // //  .filter({
    //     input: "$ccs_doc",
    //     as: "s",
    //     cond: {
    //         $eq: ["$$s.specialisation_id", "$vacancy_spec_doc.specialization_id"]
    //     },
        
    // })

     //.lookup({ from: "vacancies", localField: "vacancy_spec_doc.vacancy_id", foreignField: "_id",as: "vacancy_doc"})
    //  .project({ccs_doc:0})
    // .project({vacancy_spec_doc:0})
    // .project({vacancy_doc:0})
    //.match({"vacancy_spec_doc.specialization_id":ObjectId("5c2468b6ef69ab1c809488a9")})

    //.match({"vacancy_spec_doc.specialization_id":"ccs_doc.specialisation_id"})
 
    // let specialization=[];
    // let course=[];
    // let student=[];


    // await Vacancy_specialization.find({vacancy_id:vacancy_id})
    // .then(async result => {

    //     for(let x=0;x<result.length;x++)
    //     {
    //         specialization.push(result[x].specialization_id)
    //         console.log("Specu",specialization)
    //     }


    //     for(let x=0;x<specialization.length;x++)
    //     {
    //         await CCS_Associations.find({specialisation_id:specialization[x]})
    //         .then(async result => {

    //             for(let x=0;x<result.length;x++)
    //             {
    //                 await course.push({"id":result[x].course_id})
    //                 //console.log("course",course)
    //             }
    //         });
    //     }

    //     let test = removeDuplicates(course, "fake");
    //     console.log(test);

    //     function removeDuplicates(myArr, prop) {
    //     return myArr.filter((obj, pos, arr) => {
    //     return arr.map(mapObj =>
    //     mapObj[prop]).indexOf(obj[prop]) === pos;
    //     });
    //     }
        
    //     for(let x=0;x<test.length;x++)
    //     {
    //         await Student.find({course_id:test[x].id}).populate("college_id")
    //         .then(async result => {

    //             for(let x=0;x<result.length;x++)
    //             {
    //                 await student.push(result[x])
    //                 //console.log(student)
    //             }

    //         });
    //     }

    //     for(let x=0;x<student.length;x++)
    //         {
    //             const newRole = new Suggestion({
    //                 vacancy_id:vacancy_id,
    //                 student_id: student[x]._id,
                    
    //             });
            
    //             newRole.save();

    //             console.log("suggestion save");
                
    //         }
    // })


//User.find( { $or:[ {'_id':objId}, {'name':param}, {'nickname':param} ]},


let student=[];
let temp_student=[];

    for(let x=0;x<list.length;x++)
    {
        await Student.find({ $or:[ {'specialization_id_major':list[x]}, {'specialization_id_minor':list[x]}],status:"active"})
        .then(async result => {

            // await student.push(result[0]._id)

            for (let y = 0; y < result.length; y++) {

                temp_student[result[y]._id] = result[y]._id;
                //student.push({"id":result[y]._id})   
            }
        });
    }

    for(var k in temp_student){
        student.push({"id":temp_student[k]})   

    }

    await console.log("student",student);


        // let result = [];
        // for (let index = 0; index < student.length; index++) {
        // let el = student[index];
        // if (result.indexOf(el) === -1) result.push(el);
        // }


        // await console.log("result",result)

        // var filteredArray = student.filter(function(item, pos){
        // return student.indexOf(item)== pos; 
        // });

       // console.log( "unique",filteredArray );

        // let test = await removeDuplicates(student, "fake");
        //     console.log("test",test);

        // function removeDuplicates(myArr, prop) {
        //     return myArr.filter((obj, pos, arr) => {
        //     return arr.map(mapObj =>
        //     mapObj[prop]).indexOf(obj[prop]) === pos;
        //     });
        // }


        for(let x=0;x<student.length;x++)
            {
                const newRole = new Suggestion({
                    vacancy_id:vacancy_id,
                    student_id: student[x].id,
                    
                });
            
                newRole.save();
                
            }

        // const newRole = new Vacancy_specialization({
        //     vacancy_id:id,
        //     specialization_id: list[x],
            
        // });

        // await newRole.save()

  //***********************************new**************** */

    // var aggregate = Student.aggregate();

    // aggregate.match({"vacancy_id":ObjectId(vacancy_id)})
    // .lookup({ from: "student_enrollments", localField: "student_id", foreignField: "_id",as: "student_doc"})
    // .lookup({ from: "internships", localField: "student_doc._id", foreignField: "student_id",as: "internship_doc"})
    // .match({"student_doc.is_approved":true})
    // .lookup({ from: "colleges", localField: "student_doc.college_id", foreignField: "_id",as: "college_doc"})
    // .lookup({ from: "courses", localField: "student_doc.course_id", foreignField: "_id",as: "course_doc"})
    // .lookup({ from: "specializations", localField: "student_doc.specialization_id_major", foreignField: "_id",as: "major_doc"})
    // .lookup({ from: "specializations", localField: "student_doc.specialization_id_minor", foreignField: "_id",as: "minor_doc"})
    // .lookup({ from: "universities", localField: "college_doc.university_id", foreignField: "_id",as: "university_doc"})


    // if(searchCollege===null || searchCollege ===undefined|| searchCollege ==="")
    // {
        
    // }else
    // {
    //     if(searchCollege.length>0)
    //     {
    //         let y=[];

    //         for(let x=0;x<searchCollege.length;x++)
    //         {
    //             y.push({"student_doc.college_id":ObjectId(searchCollege[x])})
    //         }

    //         aggregate.match({$or:y});
    //     }
    // }

    // Suggestion.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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
        
    //             setting.status("Details'",true,"No data found",{pageCount:pageCount,results})

    //         );
        
    //     }
    // })
    
}


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
    var ObjectId = require('mongodb').ObjectID;

    var idd=middleware.get_id();
    var aggregate = Vacancy.aggregate();

    var page_no = req.param('page');
    var search = req.param('search');
    var searchContact = req.param('searchContact');
    var searchEmail = req.param('searchEmail');

    console.log(search)

    aggregate.sort({"createdAt" : -1})
    .match({status:"active"})
    .match({employer_id:ObjectId(idd)})
    .lookup({ from: "vacancy_specializations", localField: "_id", foreignField: "vacancy_id",as: "vacancy_spec_doc"})
    .lookup({ from: "specializations", localField: "vacancy_spec_doc.specialization_id", foreignField: "_id",as: "spec_doc"})
    .project({vacancy_spec_doc:0});
    
    if(search===null || search ===undefined)
    {
        
    }else
    {
        aggregate.match({"job_title":{"$regex": search, "$options": "i"}});
    }
    
    // if(page_no==0)
    // {
    //     res.send(
        
    //         setting.status(validation.SHOW,false,"page No error",null)

    //     );
    // }

    var options = { page : page_no, limit : setting.pagecontent}

    Vacancy.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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

    var idd=middleware.get_id();
	
	if(!ObjectId.isValid(id))
		{
			return res.send(
					
				setting.status("incorrect id",false,"incorrect id",null)

			 );
        }
        
    var aggregate = Vacancy.aggregate();

    aggregate.match({"_id":ObjectId(id)})
    .match({employer_id:ObjectId(idd)})
                .lookup({ from: "vacancy_specializations", localField: "_id", foreignField: "vacancy_id",as: "vacancy_spec_doc"})
                .lookup({ from: "specializations", localField: "vacancy_spec_doc.specialization_id", foreignField: "_id",as: "spec_doc"})
                .lookup({ from: "vacancy_courses", localField: "vacancy_spec_doc.vacancy_id", foreignField: "vacancy_id",as: "vacancy_course_doc"})
                .lookup({ from: "courses", localField: "vacancy_course_doc.course_id", foreignField: "_id",as: "course_doc"})
                .project({vacancy_spec_doc:0})
                .project({vacancy_course_doc:0});

    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status("page numer wrong",false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Vacancy.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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


//@route  GET api/university/id
//@desc  Get one  university
//@access Public

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
                    
                setting.status("incorrect id",false,"incorrect id",null)

                );
        }
        
        Vacancy.findByIdAndUpdate(id, {
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

    var result=vacancyValidation.CheckValidation(req.body);
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

    Vacancy_specialization.remove({vacancy_id:id})
    .exec()
    .then(() => {

        let list=[ ];
        list=req.body.list;

        for(let x=0;x<list.length;x++)
            {
                const newRole = new Vacancy_specialization({
                    vacancy_id:id,
                    specialization_id: list[x],
                    
                });
            
                newRole.save()
            } 
        })
    .catch(err => {
        console.log(err);
       
    });


    //let courseList=[];

    let courseList=[];
    courseList=req.body.courseList;
console.log(courseList)

    Vacancy_Course.remove({vacancy_id:id})
    .exec()
    .then(() => {

        for(let x=0;x<courseList.length;x++)
            {
                const newRole = new Vacancy_Course({
                    vacancy_id:id,
                    course_id: courseList[x],
                    
                });
                newRole.save()
            } 
        })
    .catch(err => {
        console.log(err);
       
    });
    
    Vacancy.findOne({
            _id: id
        })
        .then(university => {
            if (university) {
                
                Vacancy.findOneAndUpdate(
                    { _id : id },
                    {$set:{
                        job_title: req.body.job_title,
                        number: req.body.number,
                        description:req.body.description,
                        closing_date:req.body.closing_date,
                        status:req.body.status, 
                        job_location: req.body.job_location,
                        job_start_date: req.body.job_start_date,
                        desired_skills: req.body.desired_skills,
                        desired_educational_qualification: req.body.desired_educational_qualification,
                        minimum_percentage: req.body.minimum_percentage,
                        minimum_grade: req.body.minimum_grade,
                        minimum_cgpa: req.body.minimum_cgpa,
                       }},
                    {runValidators: true, context: 'query' })
                   // {_id:id}}
                  .then(university =>{
                    res.json(
		
                        setting.status("Vacancy Updated",true,"updated",university)
                
                      );
                  })
                  .catch(err =>{
                   
                    res.json(

                        setting.status("Error",false,"error",err)
                
                    );
                       
                  });
            } else {
                res.json(
		
                    setting.status("University Not Found",false,"error",err)
            
                  );
            }
        })
})


//@route GET api/university/universityupdate
//@desc Register route
//@access Public
router.post('/:id/interview',middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_EDIT_UNIVERSITIES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    // var result=vacancyValidation.CheckValidation(req.body);
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var ObjectId = require('mongodb').ObjectID;

	if(!ObjectId.isValid(req.params.id))
        {
            return res.send(
                        
                setting.status("ID wrong",false,"object id wrong",null)

            );
        }
        
    const id = req.params.id;
    
    Vacancy.findOne({
            _id: id
        })
        .then(university => {
            if (university) {
                
                Vacancy.findOneAndUpdate(
                    { _id : id },
                    {$set:{
                        date_from : req.body.date_from,
                        date_to : req.body.date_to,
                        venue : req.body.venue,}},
                    {runValidators: true, context: 'query' })
                   // {_id:id}}
                  .then(university =>{
                    res.json(
		
                        setting.status("Vacancy Updated",true,"updated",university)
                
                      );
                  })
                  .catch(err =>{
                   
                    res.json(

                        setting.status("Error",false,"error",err)
                
                    );
                       
                  });
            } else {
                res.json(
		
                    setting.status("University Not Found",false,"error",err)
            
                  );
            }
        })
})



//************************************************************************************************************ */
//*********************************View candidates for an vacancy********************************************* */
//************************************************************************************************************ */

router.get('/:vacancy_id/candidates', middleware.checkToken,(req, res) => {

    var ObjectId = require('mongodb').ObjectID;
    var vacancy_id=req.params.vacancy_id;
	
	if(!ObjectId.isValid(vacancy_id))
		{
			return res.send(
					
				setting.status("Incorrect Id",false,"incorrect id",null)

			 );
        }
        
    var aggregate = Invite.aggregate();

    
    // 1=interview invitation pending
    // 2=interview invitation is_accepted
    // 3=interview invitation rejected
    // 4=interview rejected
    // 5=offer request pending
    // 6=offer rejected
    // 7=offer given

    var status=req.param('status');

    console.log("status" +status)

    aggregate.match({"vacancy_id":ObjectId(vacancy_id)})
    //.match({status:status})
    .lookup({ from: "student_enrollments", localField: "student_id", foreignField: "_id",as: "student_doc"})
    .lookup({ from: "internships", localField: "student_doc._id", foreignField: "student_id",as: "internship_doc"})
    .lookup({ from: "colleges", localField: "student_doc.college_id", foreignField: "_id",as: "college_doc"})
    .lookup({ from: "courses", localField: "student_doc.course_id", foreignField: "_id",as: "course_doc"})
    .lookup({ from: "specializations", localField: "student_doc.specialization_id_major", foreignField: "_id",as: "major_doc"})
    .lookup({ from: "specializations", localField: "student_doc.specialization_id_minor", foreignField: "_id",as: "minor_doc"})
    .project({"student_doc.password":0})


    if(status===null || status ===undefined ||status==="")
        {
            
        }else
        {
            aggregate.match({status:status})

        }


    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status("page error",false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Invite.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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

//************************************************************************************************************ */
//*************************************View Students Status*************************************************** */
//************************************************************************************************************ */

router.get('/students/:id/', middleware.checkToken,(req, res) => {

    var ObjectId = require('mongodb').ObjectID;
    var student_id=req.params.id;
	
	if(!ObjectId.isValid(student_id))
		{
			return res.send(
					
				setting.status("Incorrect Id",false,"incorrect id",null)

			 );
        }
        
    var aggregate = Invite.aggregate();
    
    // 1=interview invitation pending
    // 2=interview invitation is_accepted
    // 3=interview invitation rejected
    // 4=interview rejected
    // 5=offer request pending
    // 6=offer rejected
    // 7=offer given

    var status=req.param('status');

    console.log("status" +status)

    aggregate.match({"student_id":ObjectId(student_id)})
    .lookup({ from: "student_enrollments", localField: "student_id", foreignField: "_id",as: "student_doc"})
    .lookup({ from: "internships", localField: "student_doc._id", foreignField: "student_id",as: "internship_doc"})
    .lookup({ from: "vacancies", localField: "vacancy_id", foreignField: "_id",as: "vacancy_doc"})
    .lookup({ from: "employers", localField: "vacancy_doc.employer_id", foreignField: "_id",as: "employer_doc"})
    .project({"student_doc.password":0})


    if(status===null || status ===undefined ||status==="")
        {
            
        }else
        {
            aggregate.match({status:status})

        }


    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status("page error",false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Invite.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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

//************************************************************************************************************* */
//*********************************Change status */

router.post('/candidates/change_status', middleware.checkToken,async (req, res) => {

    // var result=middleware.function1("CAN_ADD_EMPLOYER");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    if(req.body.student_id==undefined || req.body.student_id==null || req.body.student_id=='') 
        {
            return res.json(

                setting.status("Student ID cannot be empty",false,"student_id is empty",null)
        
            );
        }

    if(req.body.vacancy_id==undefined || req.body.vacancy_id==null || req.body.vacancy_id=='') 
        {
            return res.json(

                setting.status("Vacancy ID cannot be empty",false,"vacancy_id is empty",null)
        
            );
        }

    if(req.body.status==undefined || req.body.status==null || req.body.status=='') 
        {
            return res.json(

                setting.status("Status cannot be empty",false,"accept is empty",null)
        
            );
        }

    var ObjectId = require('mongodb').ObjectID;

	if(!ObjectId.isValid(req.body.vacancy_id))
        {
            return res.send(
                        
                setting.status("Vacancy ID wrong","False","object id wrong",null)

            );
        }

    if(!ObjectId.isValid(req.body.student_id))
        {
            return res.send(
                        
                setting.status("Student ID wrong","False","object id wrong",null)

            );
        }

    // 1=interview invitation pending
    // 2=interview invitation is_accepted
    // 3=interview invitation rejected
    // 4=interview rejected
    // 5=offer request pending
    // 6=offer rejected
    // 7=offer given

    var student_id=req.body.student_id;
    var vacancy_id=req.body.vacancy_id;
    var status=req.body.status;

    console.log("status",status)

    if(status==="1")  //1=Interview invitation pending  Employer
    {
        const newInvite = new Invite({
            student_id: student_id,
            vacancy_id: vacancy_id,
            status:status,
            });
        
            newInvite.save()
            .then(college =>{ 
                
            reject(vacancy_id,student_id)
                    
                res.json(
        
                    setting.status("Succesfully Invite for interview",true,"invited",college)
            
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
    }
    
    else if(status===0)
    {
        reject(vacancy_id,student_id)

    }
    
    else
    {
        Invite.findOneAndUpdate(
            { student_id : student_id,vacancy_id:vacancy_id },
            {$set:{
            status:status,
        }},
        {runValidators: true, context: 'query' })

        .then(college =>{  
                    
            res.json(
    
                setting.status("Succesfully Invite",true,"invited",college)
        
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
    }

    var employer_id=middleware.get_id();
    var email="";
    var name="";
    var job_title="";
    var emp_name="";
    var emp_email="";
    var emp_id="";

    Student.find({_id:student_id})
        .then(async result => {

         email=await result[0].email;
         name=await result[0].fname;
    

    Vacancy.find({_id:vacancy_id}).populate("employer_id")
        .then(async result => {

         job_title=await result[0].job_title;
         emp_name=await result[0].employer_id.name;
         emp_email=await result[0].employer_id.email;
         emp_id=await result[0].employer_id._id;

    

    // Employer.find({_id:employer_id})
    //     .then(async result => {

    //     var emp_name=await result[0].name;
    //     var emp_email=await result[0].email;

    // });

    var html;
    
    if(status==="1")  //1=Interview invitation pending  Employer
    {

        html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
        <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
        CAS SHRC: Invitation for an Interview </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="http://172.104.40.142:3000" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
        Interview Invitation</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
        Dear ` + name + `, you have been invited for an interview for the position of ` + job_title + ` in `+ emp_name +`.
		You may contact the employer via this email: `+ emp_email +`
        </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="http://172.104.40.142:3000" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
        GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
        <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
    
        sendMail.sendMail(email,html,'CAS SHRC: Invitation for an Interview')
        setting.save_notification(student_id,emp_id,vacancy_id,"Invited for an Interview","1")

    }

    else if(status==="2") //interview invitation accepted  Student
    {

        html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
        <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
        CAS SHRC: Interview Invitation Accepted </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="http://172.104.40.142:3000" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
        Invitation Accepted</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
        Dear ` + emp_name + `, your interview invitation for the position of ` + job_title + ` has been accepted by `+ name +`.
		You may contact the student via this email: `+ email +`
        </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="http://172.104.40.142:3000" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
        GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
        <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
    
        // sendMail.sendMail(email,html,'Job Interview','Invite to interview')
        sendMail.sendMail(emp_email,html,'CAS SHRC: Interview Invitation Accepted')
        setting.save_notification(student_id,emp_id,vacancy_id,"Interview invitation sccepted","2")


    }

    else if(status==="3") //interview invitation rejected  Student
    {

        html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
        <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
        CAS SHRC: Interview Invitation Rejected </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="http://172.104.40.142:3000" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
        Invitation Rejected</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
        Dear ` + emp_name + `, your interview invitation for the position of ` + job_title + ` has been rejected by `+ name +`. 
		You can try more potential candidates through the application.
        </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="http://172.104.40.142:3000" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
        GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
        <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
    
        // sendMail.sendMail(email,html,'Job Interview','Invite to interview')
        sendMail.sendMail(emp_email,html,'CAS SHRC: Interview Invitation Rejected')
        setting.save_notification(student_id,emp_id,vacancy_id,"Interview invitation Rejected","3")

    }

    else if(status==="4") //interview rejected  EMployer
    {

        html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
        <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
        CAS SHRC: Interview Result </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="http://172.104.40.142:3000" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
        Sorry, better luck next time</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
        Dear ` + name + `, you have not been selected in the interview for the position of  ` + job_title + ` in  `+ emp_name+`. 
		<br/>Tough luck this time; We wish you all the very best in your future endeavors. <br/>Keep checking the application for more opportunities.
        </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="http://172.104.40.142:3000" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
        GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
        <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
    
        // sendMail.sendMail(email,html,'Job Interview','Invite to interview')
        sendMail.sendMail(email,html,'CAS SHRC: Interview Result')
        setting.save_notification(student_id,emp_id,vacancy_id,"Interview was not successful","4")


    }

    else if(status==="5") //offer request pending  EMployer
    {

        html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
        <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
        CAS SHRC: Interview Result </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="http://172.104.40.142:3000" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
        Congratulations</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
        Dear ` + name + `, you have been selected in the interview for the position of  ` + job_title + ` in  `+ emp_name+`. 
		You may contact the student via this email: `+ email +` and confirm them your willingness as soon as possible.
        </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="http://172.104.40.142:3000" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
        GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
        <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
    
        // sendMail.sendMail(email,html,'Job Interview','Invite to interview')
        sendMail.sendMail(email,html,'CAS SHRC: Interview Result')
        setting.save_notification(student_id,emp_id,vacancy_id,"Interview was successfully completed","5")


    }

    else if(status==="6") //offer rejected   student
    {

        html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
        <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
        CAS SHRC: Offer Request Rejected </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="http://172.104.40.142:3000" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
        Offer Rejected</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
        Dear ` + emp_name + `, your offer invitation for the position of ` + job_title + ` has been rejected by `+ name +`. 
		You can try more potential candidates through the application.
        </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="http://172.104.40.142:3000" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
        GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
        <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
    
        // sendMail.sendMail(email,html,'Job Interview','Invite to interview')
        sendMail.sendMail(emp_email,html,'CAS SHRC: Offer Request Rejected')
        setting.save_notification(student_id,emp_id,vacancy_id,"Job offer was rejected","6")


    }

    else if(status==="7") //offer given   student
    {

        html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
        <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
        CAS SHRC: Offer Request Accepted </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="http://172.104.40.142:3000" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
        Reject to interview</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
        Dear ` + emp_name + `, your offer for the position of ` + job_title + ` has been accepted by `+ name +`.
		You may contact the student via this email: `+ email +`
        </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="http://172.104.40.142:3000" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
        GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
        <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
    
        // sendMail.sendMail(email,html,'Job Interview','Invite to interview')
        sendMail.sendMail(emp_email,html,'CAS SHRC: Offer Request Accepted')
        setting.save_notification(student_id,emp_id,vacancy_id,"Job offer was accepted","7")

    }
    
});
});
})

function reject(vacancy_id,student_id)
{
    Suggestion.remove({vacancy_id:vacancy_id,student_id:student_id})
    .exec()
    .then(() => {
            console.log("reject")
        })
    .catch(err => {
        console.log(err);
        res.json(

        setting.status("Error",false,"errorr",err)

        );
    }); 
}

// **************************update information to where the student interview and date**************************

//************************************************************************************************************* */
router.post("/student/:student_id/vacancy/:vacancy_id/update",middleware.checkToken, (req, res) => {

    var student_id=req.params.student_id;
    var vacancy_id=req.params.vacancy_id;
  
    Invite.findOneAndUpdate(
        { student_id : student_id,vacancy_id:vacancy_id },
        {$set:{
        date:req.body.date,venue:req.body.venue,
    }},
    {runValidators: true, context: 'query' })

    .then(college =>{  
                
        res.json(

            setting.status("Succesfully Invite",true,"invited",college)
    
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

module.exports = router;