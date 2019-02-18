const express = require('express');
const router = express.Router();
//const passport = require('passport');
//Load Input Validation
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employer = require('../../models/employer');
const Invite = require('../../models/invite');
const Vacancy_Student = require('../../models/vacancy_student');
const setting=require("../return_msg/setting");
const employerValidation=require("../validation/employer");
let middleware = require('../../validation/middleware');
const Role_authority = require('../../models/role_authority');
const config = require('../../config/keys.js');
var nodemailer = require('nodemailer');
var generator = require('generate-password');
const Vacancy = require('../../models/vacancy');
const CCS_Associations = require('../../models/ccs_association');
const Vacancy_specialization = require('../../models/vacancy_specializations');
const Student = require('../../models/student_enrollment');
var sendMail=require("../return_msg/sendMail");
var unique = require('array-unique');
const Suggestion = require('../../models/suggestion');
const Notification = require('../../models/notification');
const Offer = require('../../models/offer');


//@route GET api/employer/
//@desc Register route
//@access Public
router.post('/', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_ADD_EMPLOYER");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }
    console.log(req.body);

    var result=employerValidation.CheckValidation(req.body);
    if(!result.status)
    {
        return res.send(result);
    }

        Employer.findOne({
            email: req.body.email
        })
        .then(college => {
            if (college) {
                res.json(
		
                    setting.status("Email already exits",false,"email already exits",null)
            
                  );
            } else {

                var randPassword = generator.generate({
                    length: 8,
                    numbers: true
                  });
                  
                                 
                  //Hashing password 
                  var hashedPassword = bcrypt.hashSync(randPassword, 10); //Hashing password to unreadable

                const newCollege = new Employer({
                    name: req.body.name,
                    email: req.body.email,
                    contact_no:req.body.contact_no,
                    website:req.body.website,
                    address:req.body.address,
                    state: req.body.state,
                    city: req.body.city,
                    pin_code:req.body.pin_code,
                    hr_name:req.body.hr_name,
                    hr_email: req.body.hr_email,
                    hr_contact_no: req.body.hr_contact_no,
                    status:req.body.status,
                    description: req.body.description,
                    industry: req.body.industry,
                    locations:req.body.locations,
                    //role:"5c45399c6b72f02628eb8c5b",
                    role:"5c45399c6b72f02628eb8c5b",
                    password:hashedPassword
                });

                            newCollege.save()
                            .then(college =>{

                                
                                    var html= `<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
                                    <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
                                    Registered successfully. </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
                                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                                    Successfully Registered</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
                                    Hi ` + req.body.name + `, you have been successfully registered to the CAS Job Placements. 
                                    <p  style="color:black">Your username: `+req.body.email+` </p> <p>Password: `+randPassword+`</p></td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                    GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
                                    <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
                                 
                  
                                  sendMail.sendMail(req.body.email,html,'Successfully Registered')

                                res.json(
                
                                    setting.status("Employer created",true,"created",college)
                            
                                  );
                            })
                            .catch(err => {
                                console.log(err)
                                if(err.errors.email)
                                {
                                    res.json(
                
                                        setting.status("Employer Email Already Exits",false,"email unique",null)
                                
                                      );
                                }
        
                                if(err.errors.contact_no)
                                {
                                    res.json(
                
                                        setting.status("Employer Contact Number Already Exits",false,"contact_no unique",null)
                                
                                      );
                                }
        
                                if(err.errors.hr_email)
                                {
                                    res.json(
                
                                        setting.status("HR Email Already Exits",false,"hr_email unique",null)
                                
                                      );
                                }
        
                                if(err.errors.hr_contact_no)
                                {
                                    res.json(
                
                                        setting.status("HR Contact Number Already Exits",false,"hr_contact_no unique",null)
                                
                                      );
                                }
        
                                
                            });
                      
                
            }
        })
})

//@route  GET api/college/
//@desc  Get all  college
//@access Public
router.get('/', middleware.checkToken, (req, res) => {

    // var result=middleware.function1("CAN_VIEW_EMPLOYER");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }


    var aggregate = Employer.aggregate();

    var page_no = req.param('page');
    var search = req.param('search');
	var searchEmail = req.param('searchEmail');
	var searchContact = req.param('searchContact');
    var searchIndustry = req.param('searchIndustry');

    aggregate.sort({"createdAt" : -1})            
    //.match({status:"active"})


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

    if(searchIndustry===null || searchIndustry ===undefined)
    {
        
    }else
    {
        aggregate.match({"industry":{"$regex": searchIndustry, "$options": "i"}});
    }
    
    if(page_no==0)
    {
        res.send(
        
            setting.status("page no error",false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Employer.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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

    // var result=middleware.function1("CAN_VIEW_EMPLOYER");
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
        
    var aggregate = Employer.aggregate();

    aggregate.match({"_id":ObjectId(id)})
    //.match({status:"active"})


    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status("page no error",false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Employer.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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

    // var result=middleware.function1("CAN_DELETE_EMPLOYER");
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
        
        Employer.findByIdAndUpdate(id, {
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

    // var result=middleware.function1("CAN_EDIT_EMPLOYER");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }


    var resultVali=employerValidation.CheckValidation(req.body);
    if(!resultVali.status)
    {
        return res.send(resultVali);
    }
    
    var ObjectId = require('mongodb').ObjectID;
    var id=req.params.id;
	
	if(!ObjectId.isValid(id))
		{
			return res.send(
					
				setting.status("incorrect id",false,"incorrect id",null)

			 );
		}

    Employer.findOne({
            _id: id
        })
        .then(college => {
            if (college) {
                Employer.findOneAndUpdate(
                    { _id : id },
                    {$set:{
                    name: req.body.name,
                    email: req.body.email,
                    contact_no:req.body.contact_no,
                    website:req.body.website,
                    address:req.body.address,
                    state: req.body.state,
                    city: req.body.city,
                    pin_code:req.body.pin_code,
                    hr_name:req.body.hr_name,
                    hr_email: req.body.hr_email,
                    hr_contact_no: req.body.hr_contact_no,
                    status:req.body.status,
                    description: req.body.description,
                    industry: req.body.industry,
                    locations:req.body.locations,}},
                    {runValidators: true, context: 'query' })
                  .then(college =>{
                    res.json(
		
                        setting.status("Employer Updated",true,"updated",college)
                
                      );
                  })
                  .catch(err =>{
                        if(err.errors.email)
                        {
                            res.json(
		
                                setting.status("Employer Email Already Exits",false,"email unique",null)
                        
                              );
                        }

                        if(err.errors.contact_no)
                        {
                            res.json(
		
                                setting.status("Employer Contact Number Already Exits",false,"contact_no unique",null)
                        
                              );
                        }

                        if(err.errors.hr_email)
                        {
                            res.json(
		
                                setting.status("HR Email Already Exits",false,"hr_email unique",null)
                        
                              );
                        }

                        if(err.errors.hr_contact_no)
                        {
                            res.json(
		
                                setting.status("HR Contact Number Already Exits",false,"hr_contact_no unique",null)
                        
                              );
                        }
                  });
            } else {
                res.json(
		
                    setting.status("Employer Not Found",false,"error",err)
            
                  );
            }
        })
})


router.post('/change_password/:id', middleware.checkToken,(req, res) => {

    
    var ObjectId = require('mongodb').ObjectID;
    var id=req.params.id;
	
	if(!ObjectId.isValid(id))
		{
			return res.send(
					
				setting.status("incorrect id",false,"incorrect id",null)

			 );
        }
        
    if(req.body.password==undefined || req.body.password==null || req.body.password=='') 
    {
        
        return res.json(
                
            setting.status("Password cannot be empty",false,"password is empty",null)
    
          );
        
    }

    if(req.body.new_password==undefined || req.body.new_password==null || req.body.new_password=='') 
    {
        return res.json(
                
            setting.status("New Password cannot be empty",false,"new password is empty",null)
    
          );
        
    }

    if(req.body.conform_password==undefined || req.body.conform_password==null || req.body.conform_password=='') 
    {
        return res.json(
                
            setting.status("Conform Password cannot be empty",false,"conform password is empty",null)
    
          );
        
    }

    Employer.findOne({ _id: id})
        .then(college => {
            if (college) {

                let old_password=college.password;
                let coming_password=req.body.password;
                let new_password=req.body.new_password;
                let conform_password=req.body.conform_password;

                var passwordIsValid = bcrypt.compareSync(req.body.password, college.password);
                if (!passwordIsValid)
                return res.send(
                    
                        setting.status("Wrong Pasword",false,"password wrong",null)
                
                    );

                let hashPassword="";

                    if(new_password===conform_password)
                    {
                        bcrypt.genSalt(10, (err, salt) =>
                            {
                                bcrypt.hash(new_password, salt, (err, hash) =>
                                {
                                    if (err)
                                        throw err;
                                        hashPassword = hash;

                                        Employer.findOneAndUpdate(
                                            { _id : id },
                                            {$set:{
                                            password:hashPassword,
                                            is_password_defalut:0
                                            }},
                                            {runValidators: true, context: 'query' })
                                          .then(college =>{
                                            return res.json(
                            
                                                    setting.status("Password Changed",true,"updated",null)
                                            
                                                );
                                          })
                                          .catch(err =>{
                                                
                                                if(err)
                                                {
                                                    return res.json(
                                
                                                        setting.status("Error",false,"error",err)
                                                
                                                      );
                                                }
                                          });

                                })
                            });
                       
                        
                    }else
                    {
                        return res.json(
		
                            setting.status("Password Not Match",false,"newpassword not match to conform password",null)
                    
                        );
                    }

                
            } else {
                return res.json(
		
                    setting.status("Employer Not Found",false,"error",err)
            
                  );
            }
        })
})


router.post('/change_status/:id', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_EDIT_EMPLOYER");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    console.log("mano");

    
    var ObjectId = require('mongodb').ObjectID;
    var id=req.params.id;
	
	if(!ObjectId.isValid(id))
		{
			return res.send(
					
				setting.status("incorrect id",false,"incorrect id",null)

			 );
		}

    Employer.findOne({
            _id: id
        })
        .then(college => {
            if (college) {
                Employer.findOneAndUpdate(
                    { _id : id },
                    {$set:{
                    status:req.body.status}},
                    {runValidators: true, context: 'query' })
                  .then(college =>{
                    res.json(
		
                        setting.status("Employer Status Updated",true,"updated",college.status)
                
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
		
                    setting.status("Employer Not Found",false,"error",err)
            
                  );
            }
        })
})

router.post("/emp/login", (req, res) =>{

    console.log(req.body);
  
    if(req.body.email==undefined || req.body.email==null || req.body.email=='') 
    {
        res.send(
        
          setting.status("Email acnnot be empty",false,"email empty",null)
  
      );
    }

  
    if(req.body.password==undefined || req.body.password==null || req.body.password=='') 
    {
        res.send(
        
          setting.status("Password cannot be empty",false,"password empty",null)
  
      );
    }
  
      var email = req.body.email;
      var password = req.body.password;
  
      Employer.findOne({email: email}, function (err, user)
      {
          if (err)
              return res.send(
            
                setting.status("Try Again",false,"Error on server",err)
        
            );
  
          if (!user)
              return res.send(
            
                setting.status("Authentication false",false,"user not found",null)
        
            );
  
            if (!user)
               returnres.send(
            
                setting.status("Authentication false",false,"user not found",null)
        
            );

            console.log("mano")
  
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid)
                  res.send(
                
                    setting.status("Wrong Pasword",false,"password wrong",null)
            
                );
  
  
                let authority=[];
                let role='Employer';
  
            Role_authority.find({role_id:user.role})//.populate('role_id')
            .then(result => {
               // role=result[0].role_id.name;
                if(result.length>0)
                {
                    for(var x=0;x<result.length;x++)
                    {
                        authority.push(result[x].authority)
                    }
                }else
                {
                    //return ("authority not found")
                }
  
              var token = jwt.sign({ id: user._id,name:user.fname,authority:authority,email:user.email,contact_no:user.contact_no,role:user.role,role_name:role,default_password:user.is_password_defalut }, config.secretOrKey, {expiresIn: 86400});
  
              res.send(
                  
                    setting.status("Login success",true,"Authentication true",{"loginToken":token})        
                  );
              });
      })
    })




//********************************************************* */ Vacancy/********************************************** */

//********************************************************************************************************************** */



router.post('/suggestion/:vacancy_id',middleware.checkToken,async (req, res) => { //middleware.checkToken,

    // var result=middleware.function1("CAN_VIEW_UNIVERSITIES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

   
    var ObjectId = require('mongodb').ObjectID;
    var vacancy_id=req.params.vacancy_id;
	console.log(vacancy_id)
	if(!ObjectId.isValid(vacancy_id))
		{
			return res.send(
					
				setting.status("Incorrect ID",false,"incorrect id",null)

			 );
        }

    let searchUni=[];
    let searchCollege=[];
    let searchCourse=[];
    let searchSpecialization=[];
    searchUni=req.body.searchUni;
    searchCollege=req.body.searchCollege;
    searchCourse=req.body.searchCourse;
    searchSpecialization=req.body.searchSpecialization;

    var searchageFrom = req.body.searchageFrom;
    var searchageTo = req.body.searchageTo;
    var searchGender = req.body.searchGender;
    var searchMarks = req.body.searchMarks;
    var searchAcadamicFrom = req.body.searchAcadamicFrom;
    var searchAcadamicTo = req.body.searchAcadamicTo;
    var searchCGPA=req.body.searchCGPA;
    var searchPercentage=req.body.searchPercentage;
    var searchGrade=req.body.searchGrade;

    ///var searchSpecialization = req.param('searchSpecialization');
   
   var aggregate = Suggestion.aggregate();

     aggregate.match({"vacancy_id":ObjectId(vacancy_id)})
     .lookup({ from: "student_enrollments", localField: "student_id", foreignField: "_id",as: "student_doc"})
     .lookup({ from: "internships", localField: "student_doc._id", foreignField: "student_id",as: "internship_doc"})
     .match({"student_doc.is_approved":true})
     .lookup({ from: "colleges", localField: "student_doc.college_id", foreignField: "_id",as: "college_doc"})
     .lookup({ from: "courses", localField: "student_doc.course_id", foreignField: "_id",as: "course_doc"})
     .lookup({ from: "specializations", localField: "student_doc.specialization_id_major", foreignField: "_id",as: "major_doc"})
     .lookup({ from: "specializations", localField: "student_doc.specialization_id_minor", foreignField: "_id",as: "minor_doc"})
     .lookup({ from: "universities", localField: "college_doc.university_id", foreignField: "_id",as: "university_doc"})
    // .match({status:"active"})
    // if(searchUni===null || searchUni ===undefined|| searchUni ==="")
    // {
        
    // }else
    // {
    //     if(searchUni.length>0)
    //     {
    //         for(let x=0;x<searchUni.length;x++)
    //         {
    //             aggregate.match({"university_doc._id":ObjectId(searchUni)});
    //         }
    //     }
    // }

    //console.log("college ",searchCollege[0]);

    if(searchPercentage===null || searchPercentage ===undefined ||searchPercentage==="")
        {
            
        }else
        {
            aggregate.match({"course_doc.marking_criteria":"percentage"});
            aggregate.match({"student_doc.overall_grade":{$gte: parseInt(searchPercentage)}});

        }

    if(searchCGPA===null || searchCGPA ===undefined ||searchCGPA==="")
        {
            
        }else
        {
            aggregate.match({"course_doc.marking_criteria":"cgpa"});
            aggregate.match({"student_doc.overall_grade":{$gte: parseInt(searchCGPA)}});

        }

    if(searchGrade===null || searchGrade ===undefined ||searchGrade==="")
        {
            
        }else
        {
            aggregate.match({"course_doc.marking_criteria":"grade"});
            aggregate.match({"student_doc.overall_grade":searchGrade});

        }

    if(searchCollege===null || searchCollege ===undefined|| searchCollege ==="")
    {
        
    }else
    {
        if(searchCollege.length>0)
        {
            let y=[];

            for(let x=0;x<searchCollege.length;x++)
            {
                y.push({"student_doc.college_id":ObjectId(searchCollege[x])})
            }

            aggregate.match({$or:y});
        }
    }

    if(searchCourse===null || searchCourse ===undefined|| searchCourse ==="")
    {
        
    }else
    {
        if(searchCourse.length>0)
        {
            let y=[];

            for(let x=0;x<searchCourse.length;x++)
            {
                y.push({"student_doc.course_id":ObjectId(searchCourse[x])})
            }

            aggregate.match({$or:y});
        }
    }

    if(searchSpecialization===null || searchSpecialization ===undefined|| searchSpecialization ==="")
    {
        
    }else
    {
        if(searchSpecialization.length>0)
        {
            let y=[];

            for(let x=0;x<searchSpecialization.length;x++)
            {
                y.push({"student_doc.specialization_id_major":ObjectId(searchSpecialization[x])})
            }

            aggregate.match({$or:y});
        }
    }

    if(searchageFrom===null || searchageFrom ===undefined|| searchageFrom ==="" ||searchageTo===null || searchageTo ===undefined||searchageTo ==="")
        {
            
        }else
        {
            aggregate.match ({"student_doc.age": {$gte: searchageFrom ,$lt: searchageTo}});
        }

    if(searchGender===null || searchGender ===undefined ||searchGender==="")
        {
            
        }else
        {
            aggregate.match({"student_doc.gender":{"$regex": searchGender, "$options": "i"}});

        }

    if(searchMarks===null || searchMarks ===undefined||searchMarks==="")
        {
            
        }else
        {
            aggregate.match({"student_doc.overall_grade":{$gte: parseInt(searchMarks)}});

        }
        
    if(searchAcadamicFrom===null || searchAcadamicFrom ===undefined|| searchAcadamicFrom ==="" ||searchAcadamicTo===null || searchAcadamicTo ===undefined||searchAcadamicTo ==="")
        {
            
        }else
        {
            aggregate.match ({"student_doc.academic_to": {$gte: searchAcadamicFrom ,$lt: searchAcadamicTo}});
        }

    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status("Error",false,"page No error",null)

        );
    }

    var options = { page : page_no, limit :setting.pagecontent }

    Suggestion.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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
        
                setting.status("Details'",true,"No data found",{pageCount:pageCount,results})

            );
        
        }
    })       
})


router.post('/vacancy/:vacancy_id/student/:student_id/invite', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_ADD_EMPLOYER");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    if(req.params.student_id==undefined || req.params.student_id==null || req.params.student_id=='') 
        {
            return res.json(

                setting.status("Student ID cannot be empty",false,"student_id is empty",null)
        
            );
        }

    if(req.params.vacancy_id==undefined || req.params.vacancy_id==null || req.params.vacancy_id=='') 
        {
            return res.json(

                setting.status("Vacancy ID cannot be empty",false,"vacancy_id is empty",null)
        
            );
        }

    var ObjectId = require('mongodb').ObjectID;

	if(!ObjectId.isValid(req.params.vacancy_id))
        {
            return res.send(
                        
                setting.status("Vacancy ID wrong","False","object id wrong",null)

            );
        }

    if(!ObjectId.isValid(req.params.student_id))
        {
            return res.send(
                        
                setting.status("Student ID wrong","False","object id wrong",null)

            );
        }

    var student_id=req.params.student_id;
    var vacancy_id=req.params.vacancy_id;
    console.log(req.body.accept)

    if(req.body.accept==="accept")
    {

        const newInvite = new Invite({
        student_id: student_id,
        vacancy_id: vacancy_id,
        status:'1',
        //is_accepted:false,
        });

            newInvite.save()
            .then(college =>{
            
                var html;
                
                Student.find({_id:student_id})
                .then(result => {

                    var email=result[0].email;
                    var name=result[0].fname;

                Vacancy.find({_id:vacancy_id}).populate("employer_id")
                .then(async result => {

                    var job_title=await result[0].job_title;
                    var emp_name=await result[0].employer_id.name;
                    var emp_email=await result[0].employer_id.email;


                    
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
                
                    sendMail.sendMail(email,html,'Job Invitation')
                        
                    });
                });  
                
                
            reject(vacancy_id,student_id)
                
            res.json(

                setting.status("Succesfully Invited",true,"invited",college)
        
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
    
    else if(req.body.accept==="reject")
    {
        reject(vacancy_id,student_id);
        res.json(

            setting.status("Rejected",true,"rejected",null)

        );
    }
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


router.get('/vacancy/:vacancy_id/invite', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_VIEW_EMPLOYER");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }


    var ObjectId = require('mongodb').ObjectID;
    var vacancy_id=req.params.vacancy_id;
	
	if(!ObjectId.isValid(vacancy_id))
		{
			return res.send(
					
				setting.status("Incorrect Id",false,"incorrect id",null)

			 );
        }
        
    var aggregate = Invite.aggregate();

    aggregate.match({"vacancy_id":ObjectId(vacancy_id)})
    //.match({status:"active"})    
    .lookup({ from: "student_enrollments", localField: "student_id", foreignField: "_id",as: "student_doc"})
    .lookup({ from: "internships", localField: "student_doc._id", foreignField: "student_id",as: "internship_doc"})
    .lookup({ from: "colleges", localField: "student_doc.college_id", foreignField: "_id",as: "college_doc"})
    .lookup({ from: "courses", localField: "student_doc.course_id", foreignField: "_id",as: "course_doc"})
    .lookup({ from: "specializations", localField: "student_doc.specialization_id_major", foreignField: "_id",as: "major_doc"})
    .lookup({ from: "specializations", localField: "student_doc.specialization_id_minor", foreignField: "_id",as: "minor_doc"})
    .project({"student_doc.password":0})

    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status("page no error",false,"page No error",null)

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


router.get('/vacancy/:vacancy_id/accepted', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_VIEW_EMPLOYER");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }


    var ObjectId = require('mongodb').ObjectID;
    var vacancy_id=req.params.vacancy_id;
	
	if(!ObjectId.isValid(vacancy_id))
		{
			return res.send(
					
				setting.status("Incorrect Id",false,"incorrect id",null)

			 );
        }
        
    var aggregate = Invite.aggregate();

    aggregate.match({"vacancy_id":ObjectId(vacancy_id)})
    .match({is_accepted:true})
    //.match({status:"active"})
    .lookup({ from: "student_enrollments", localField: "student_id", foreignField: "_id",as: "student_doc"})
    .lookup({ from: "internships", localField: "student_doc._id", foreignField: "student_id",as: "internship_doc"})
    .lookup({ from: "colleges", localField: "student_doc.college_id", foreignField: "_id",as: "college_doc"})
    .lookup({ from: "courses", localField: "student_doc.course_id", foreignField: "_id",as: "course_doc"})
    .lookup({ from: "specializations", localField: "student_doc.specialization_id_major", foreignField: "_id",as: "major_doc"})
    .lookup({ from: "specializations", localField: "student_doc.specialization_id_minor", foreignField: "_id",as: "minor_doc"})
    .project({"student_doc.password":0})

    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status("incorrect page number",false,"page No error",null)

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

router.post('/vacancy/:vacancy_id/student/:student_id/interview', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_ADD_EMPLOYER");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    if(req.params.student_id==undefined || req.params.student_id==null || req.params.student_id=='') 
        {
            return res.json(

                setting.status("Student ID cannot be empty",false,"student_id is empty",null)
        
            );
        }

    if(req.params.vacancy_id==undefined || req.params.vacancy_id==null || req.params.vacancy_id=='') 
        {
            return res.json(

                setting.status("Vacancy ID cannot be empty",false,"vacancy_id is empty",null)
        
            );
        }

    if(req.body.accept==undefined || req.body.accept==null || req.body.accept=='') 
        {
            return res.json(

                setting.status("Status cannot be empty",false,"accept is empty",null)
        
            );
        }

    var ObjectId = require('mongodb').ObjectID;

	if(!ObjectId.isValid(req.params.vacancy_id))
        {
            return res.send(
                        
                setting.status("Vacancy ID wrong","False","object id wrong",null)

            );
        }

    if(!ObjectId.isValid(req.params.student_id))
        {
            return res.send(
                        
                setting.status("Student ID wrong","False","object id wrong",null)

            );
        }

    var student_id=req.params.student_id;
    var vacancy_id=req.params.vacancy_id;

    if(req.body.accept==="accept")
    {
        Invite.findOneAndUpdate(
            { student_id : student_id,vacancy_id:vacancy_id },
            {$set:{
            status:"5",
        }},
        {runValidators: true, context: 'query' })
            .then(college =>{

                    var html;

                    Student.find({_id:student_id})
                    .then(result => {

                        var email=result[0].email;
                        var name=result[0].fname;

                    Vacancy.find({_id:vacancy_id}).populate("employer_id")
                    .then(async result => {

                        var job_title=await result[0].job_title;
                        var emp_name=await result[0].employer_id.name;
                        var emp_email=await result[0].employer_id.email;

                        
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
                        sendMail.sendMail(email,html,'Job Interview')

                            
                        });
                    });   
                    
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
    }else
    {
        Invite.findOneAndUpdate(
            { student_id : student_id,vacancy_id:vacancy_id },
            {$set:{
            status:"4",
        }},
        {runValidators: true, context: 'query' })
        .then(college =>{
            var html;

            Student.find({_id:student_id})
            .then(result => {

                var email=result[0].email;
                var name=result[0].fname;

            Vacancy.find({_id:vacancy_id})
            .then(result => {

                var job_title=result[0].job_title;

                
                html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
                <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
                Registered successfully. </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
                <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                Reject to interview</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
                Hi ` + name + `, you have reject to the post of ` + job_title + `. 
                </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
                <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
            

                    sendMail.sendMail(email,html,'Reject Interview')
                    
                });
            });   
            
        res.json(

            setting.status("Succesfully reject for interview",true,"rejected",college)
    
            );
        })
        .catch(err =>{
            console.log(err)
        })
    }
})


router.get('/vacancy/:vacancy_id/interview', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_VIEW_EMPLOYER");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }


    var ObjectId = require('mongodb').ObjectID;
    var vacancy_id=req.params.vacancy_id;
	
	if(!ObjectId.isValid(vacancy_id))
		{
			return res.send(
					
				setting.status("Incorrect Id",false,"incorrect id",null)

			 );
        }
        
    var aggregate = Vacancy_Student.aggregate();

    aggregate.match({"vacancy_id":ObjectId(vacancy_id)})
    //.match({status:"active"})
    .lookup({ from: "student_enrollments", localField: "student_id", foreignField: "_id",as: "student_doc"})
    .lookup({ from: "internships", localField: "student_doc._id", foreignField: "student_id",as: "internship_doc"})
    .lookup({ from: "colleges", localField: "student_doc.college_id", foreignField: "_id",as: "college_doc"})
    .lookup({ from: "courses", localField: "student_doc.course_id", foreignField: "_id",as: "course_doc"})
    .lookup({ from: "specializations", localField: "student_doc.specialization_id_major", foreignField: "_id",as: "major_doc"})
    .lookup({ from: "specializations", localField: "student_doc.specialization_id_minor", foreignField: "_id",as: "minor_doc"})
    .project({"student_doc.password":0})

    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status("page no error",false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Vacancy_Student.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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

router.post('/vacancy/:vacancy_id/student/:student_id/offer', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_ADD_EMPLOYER");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    if(req.params.student_id==undefined || req.params.student_id==null || req.params.student_id=='') 
        {
            return res.json(

                setting.status("Student ID cannot be empty",false,"student_id is empty",null)
        
            );
        }

    if(req.params.vacancy_id==undefined || req.params.vacancy_id==null || req.params.vacancy_id=='') 
        {
            return res.json(

                setting.status("Vacancy ID cannot be empty",false,"vacancy_id is empty",null)
        
            );
        }

    if(req.body.accept==undefined || req.body.accept==null || req.body.accept=='') 
        {
            return res.json(

                setting.status("Status cannot be empty",false,"accept is empty",null)
        
            );
        }

    var ObjectId = require('mongodb').ObjectID;

	if(!ObjectId.isValid(req.params.vacancy_id))
        {
            return res.send(
                        
                setting.status("Vacancy ID wrong","False","object id wrong",null)

            );
        }

    if(!ObjectId.isValid(req.params.student_id))
        {
            return res.send(
                        
                setting.status("Student ID wrong","False","object id wrong",null)

            );
        }

    var student_id=req.params.student_id;
    var vacancy_id=req.params.vacancy_id;

    if(req.body.accept==="accept")
    {
        Invite.findOneAndUpdate(
            { student_id : student_id,vacancy_id:vacancy_id },
            {$set:{
            status:"5",
        }},
        {runValidators: true, context: 'query' })
            .then(college =>{

                    var html;

                    Student.find({_id:student_id})
                    .then(result => {

                        var email=result[0].email;
                        var name=result[0].fname;

                    Vacancy.find({_id:vacancy_id})
                    .then(result => {

                        var job_title=result[0].job_title;

                        
                        html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
                        <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
                        Registered successfully. </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                        Select to interview</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
                        Hi ` + name + `, you have invite to the post of ` + job_title + `. 
                        </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                        GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
                        <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
                    

                            sendMail.sendMail(email,html,'You are selected to interview')
                            
                        });
                    });   
                    
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
    }else
    {
        Invite.findOneAndUpdate(
            { student_id : student_id,vacancy_id:vacancy_id },
            {$set:{
            status:"4",
        }},
        {runValidators: true, context: 'query' })
        .then(college =>{
           
            var html;

            Student.find({_id:student_id})
            .then(result => {

                var email=result[0].email;
                var name=result[0].fname;

            Vacancy.find({_id:vacancy_id})
            .then(result => {

                var job_title=result[0].job_title;

                
                html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
                <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
                Registered successfully. </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
                <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                Reject Offer</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
                Hi ` + name + `, you have reject offer to the post of ` + job_title + `. 
                </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
                <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
            

                    sendMail.sendMail(email,html,'Offer Rejected')
                    
                });
            });   
            
        res.json(

            setting.status("Succesfully reject offer",true,"offer rejected",college)
    
            );
        })
        .catch(err =>{
            console.log(err)
        })
    }
})


router.get('/vacancy/:vacancy_id/offer', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_VIEW_EMPLOYER");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }


    var ObjectId = require('mongodb').ObjectID;
    var vacancy_id=req.params.vacancy_id;
	
	if(!ObjectId.isValid(vacancy_id))
		{
			return res.send(
					
				setting.status("Incorrect Id",false,"incorrect id",null)

			 );
        }
        
    var aggregate = Offer.aggregate();

    aggregate.match({"vacancy_id":ObjectId(vacancy_id)})
    //.match({status:"active"})
    .lookup({ from: "student_enrollments", localField: "student_id", foreignField: "_id",as: "student_doc"})
    .lookup({ from: "internships", localField: "student_doc._id", foreignField: "student_id",as: "internship_doc"})
    .lookup({ from: "colleges", localField: "student_doc.college_id", foreignField: "_id",as: "college_doc"})
    .lookup({ from: "courses", localField: "student_doc.course_id", foreignField: "_id",as: "course_doc"})
    .lookup({ from: "specializations", localField: "student_doc.specialization_id_major", foreignField: "_id",as: "major_doc"})
    .lookup({ from: "specializations", localField: "student_doc.specialization_id_minor", foreignField: "_id",as: "minor_doc"})
    .project({"student_doc.password":0})

    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status("incorrect page no",false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Vacancy_Student.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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

router.get('/dashboard/page', middleware.checkToken,(req, res) => {

    var ObjectId = require('mongodb').ObjectID;
    var employer_id=middleware.get_id();
	
    var aggregate = Invite.aggregate();

    console.log("employer",employer_id)

    aggregate
    .lookup({ from: "vacancies", localField: "vacancy_id", foreignField: "_id",as: "vacancy_doc"})
    .lookup({ from: "employers", localField: "vacancy_doc.employer_id", foreignField: "_id",as: "employer_doc"})
    .match({"employer_doc._id":ObjectId(employer_id)})
    .group( {_id: '$status',total: {$sum: 1}})
    .project({status:"$_id",total:"$total"})
    .sort({status:1})
    
    // .lookup({ from: "colleges", localField: "student_doc.college_id", foreignField: "_id",as: "college_doc"})
    // .lookup({ from: "courses", localField: "student_doc.course_id", foreignField: "_id",as: "course_doc"})
    // .lookup({ from: "specializations", localField: "student_doc.specialization_id_major", foreignField: "_id",as: "major_doc"})
    // .lookup({ from: "specializations", localField: "student_doc.specialization_id_minor", foreignField: "_id",as: "minor_doc"})
     //.project({"student_doc.password":0})


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
        
                setting.status("Details'",true,"data found",{results})

            );
        
        }
    })       
})

router.get('/notification/all', middleware.checkToken,(req, res) => {

    var ObjectId = require('mongodb').ObjectID;
    var employer_id=middleware.get_id();
	
    var aggregate = Notification.aggregate();

    let vacancy=req.param('vacancy');
    let status=req.param('status');

    console.log(status)


    aggregate
    .match({"employer_id":ObjectId(employer_id)})
    .lookup({ from: "vacancies", localField: "vacancy_id", foreignField: "_id",as: "vacancy_doc"})
    .lookup({ from: "employers", localField: "employer_id", foreignField: "_id",as: "employer_doc"})
    .lookup({ from: "student_enrollments", localField: "student_id", foreignField: "_id",as: "stu_doc"})
    .lookup({ from: "internships", localField: "student_doc._id", foreignField: "student_id",as: "internship_doc"})
    //.lookup({ from: "invites", localField: "vacancy_id", foreignField: "_id",as: "stu_doc"})
    .project({"student_doc.password":0})
    .limit(150)

    if(status===null || status ===undefined ||status==="")
    {
        
    }else
    {
        aggregate.match({"status":status});

    }

    if(vacancy===null || vacancy ===undefined ||vacancy==="")
    {
        
    }else
    {
        aggregate.match({"vacancy_id":ObjectId(vacancy)});

        change_status(vacancy);

    }
    
    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status("page error",false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Notification.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
        if(err) 
        {
            res.send(
    
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

function change_status(vacancy_id)
{
    var ObjectId = require('mongodb').ObjectID;

    Notification.update(
        { vacancy_id: ObjectId(vacancy_id) }, //update doc with this id
        { $set:
           {
             "is_view":true
           }
        }
     )
    .then(college =>{  
                
        console.log("updated")
    })
    .catch(err => {
        
        if(err)
        {
           console.log("error",err)
                
        }
    });
}
module.exports = router;