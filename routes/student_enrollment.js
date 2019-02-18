const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const setting=require("../validation/settings");
const Page_cont=require("./return_msg/setting");
//const passport = require('passport-local');
var nodemailer = require('nodemailer');
var upload=require('express-fileupload')
const nodeMailer = require('nodemailer');
const config = require('../config/keys.js');
var app=express();
var multer=require('multer');
var upload=multer();
const bodyParser = require("body-parser");
const Invite = require('../models/invite');
const Vacancy = require('../models/vacancy');
const Offer = require('../models/offer');
const Vacancy_Student = require('../models/vacancy_student');

//Load Input Validation
const validationEnroll = require('../validation/enrollValidation');
const validationStudentUpdate = require('../validation/updateStudentValidation');
let middleware = require('../validation/middleware');
const Role_authority = require('../models/role_authority');
const Role = require('../models/role');
const Course = require('../models/course');
const Employer = require('../models/employer');
const User = require('../models/user');
const Grade = require('../models/grade');
var generator = require('generate-password');
var crypto = require('crypto');
var path = require('path')
var sendMail=require("../routes/return_msg/sendMail");
const Notification = require('../models/notification');


// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype))
//     }
//   })
   
//   var upload = multer({ storage: storage })

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)
  
        cb(null, raw.toString('hex') + path.extname(file.originalname))
      })
    }
  })
  var upload = multer({ storage: storage });

const Student = require('../models/student_enrollment');
    var mobileToSave;

// const loginStatus = require('../models/login_status');


// *** POST *** /api/users/register *** Create new student enrollment ***
router.post("/enroll/new", (req, res) => {
    console.log(req.body);
    console.log("------------");

    var validationResult = validationEnroll.checkEnrollValidation(req.body);

    if (!validationResult.status)
    {
        return res.send(validationResult);
    }
    console.log("1");

    var enteredMobile = req.body.contact_no;

    mobileToSave = '91'+ enteredMobile;

    Role.findOne({name: 'Student'})
    .then(studentss =>{
    if(studentss){
    Student.findOne({email: req.body.email})
    .then(student =>
        {
          console.log("2");

            if (student)
            {
                res.status(200).send(setting.status("Email Already exits", false, "Email unique", null))
            }
            else
            {
              console.log("3");

              Student.findOne({contact_no: req.body.contact_no})
              .then(student =>
                {
                  if (student)
                  {
                    res.status(200).send(setting.status("Contact Already exits", false, "Contact unique", null))
                  }
                  else
                  {
                    const newStudent = new Student({
                      fname: req.body.fname,
                      lname: req.body.lname,
                      contact_no: enteredMobile,
                      college_id: req.body.college_id,
                      college_id: req.body.college_id,
                      specialization_id_major: req.body.specialization_id_major,
                      specialization_id_minor: req.body.specialization_id_minor,
                      course_id: req.body.course_id,
                      email: req.body.email,
                      payment_status:"not_paid",
                      password:mobileToSave,
                      role:"5c2f0e9243abb4222c581d42",
                      status:"pending"
                    });

                    console.log("4");

                    bcrypt.genSalt(10, (err, salt) =>
                    {
                        bcrypt.hash(newStudent.password, salt, (err, hash) =>
                        {
                            if (err)
                                throw err;
                                newStudent.password = hash;

                                newStudent.save()
                    // .then(student => res.status(200).send(setting.status("Student Enrollment Successfully", true, "Student Enrolled", student._id)))
                    .then(student => 
                      {
                        console.log("Student data saved goto send mail");
						
						if(student)
						{
							
							  var html=`<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
    <!--[if gte mso 9]><xml>
     <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
     </o:OfficeDocumentSettings>
    </xml><![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width">
    <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <title></title>
    <!--[if !mso]><!-- -->
	<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
	<!--<![endif]-->
    
    <style type="text/css" id="media-query">
      body {
  margin: 0;
  padding: 0; }

table, tr, td {
  vertical-align: top;
  border-collapse: collapse; }

.ie-browser table, .mso-container table {
  table-layout: fixed; }

* {
  line-height: inherit; }

a[x-apple-data-detectors=true] {
  color: inherit !important;
  text-decoration: none !important; }

[owa] .img-container div, [owa] .img-container button {
  display: block !important; }

[owa] .fullwidth button {
  width: 100% !important; }

[owa] .block-grid .col {
  display: table-cell;
  float: none !important;
  vertical-align: top; }

.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid {
  width: 600px !important; }

.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
  line-height: 100%; }

.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4 {
  width: 200px !important; }

.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8 {
  width: 400px !important; }

.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col {
  width: 300px !important; }

.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col {
  width: 200px !important; }

.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col {
  width: 150px !important; }

.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col {
  width: 120px !important; }

.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col {
  width: 100px !important; }

.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col {
  width: 85px !important; }

.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col {
  width: 75px !important; }

.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col {
  width: 66px !important; }

.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col {
  width: 60px !important; }

.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col {
  width: 54px !important; }

.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col {
  width: 50px !important; }

@media only screen and (min-width: 620px) {
  .block-grid {
    width: 600px !important; }
  .block-grid .col {
    vertical-align: top; }
    .block-grid .col.num12 {
      width: 600px !important; }
  .block-grid.mixed-two-up .col.num4 {
    width: 200px !important; }
  .block-grid.mixed-two-up .col.num8 {
    width: 400px !important; }
  .block-grid.two-up .col {
    width: 300px !important; }
  .block-grid.three-up .col {
    width: 200px !important; }
  .block-grid.four-up .col {
    width: 150px !important; }
  .block-grid.five-up .col {
    width: 120px !important; }
  .block-grid.six-up .col {
    width: 100px !important; }
  .block-grid.seven-up .col {
    width: 85px !important; }
  .block-grid.eight-up .col {
    width: 75px !important; }
  .block-grid.nine-up .col {
    width: 66px !important; }
  .block-grid.ten-up .col {
    width: 60px !important; }
  .block-grid.eleven-up .col {
    width: 54px !important; }
  .block-grid.twelve-up .col {
    width: 50px !important; } }

@media (max-width: 620px) {
  .block-grid, .col {
    min-width: 320px !important;
    max-width: 100% !important;
    display: block !important; }
  .block-grid {
    width: calc(100% - 40px) !important; }
  .col {
    width: 100% !important; }
    .col > div {
      margin: 0 auto; }
  img.fullwidth, img.fullwidthOnMobile {
    max-width: 100% !important; }
  .no-stack .col {
    min-width: 0 !important;
    display: table-cell !important; }
  .no-stack.two-up .col {
    width: 50% !important; }
  .no-stack.mixed-two-up .col.num4 {
    width: 33% !important; }
  .no-stack.mixed-two-up .col.num8 {
    width: 66% !important; }
  .no-stack.three-up .col.num4 {
    width: 33% !important; }
  .no-stack.four-up .col.num3 {
    width: 25% !important; }
  .mobile_hide {
    min-height: 0px;
    max-height: 0px;
    max-width: 0px;
    display: none;
    overflow: hidden;
    font-size: 0px; } }

    </style>
</head>
<body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e2eace">
  <style type="text/css" id="media-query-bodytag">
    @media (max-width: 520px) {
      .block-grid {
        min-width: 320px!important;
        max-width: 100%!important;
        width: 100%!important;
        display: block!important;
      }

      .col {
        min-width: 320px!important;
        max-width: 100%!important;
        width: 100%!important;
        display: block!important;
      }

        .col > div {
          margin: 0 auto;
        }

      img.fullwidth {
        max-width: 100%!important;
      }
			img.fullwidthOnMobile {
        max-width: 100%!important;
      }
      .no-stack .col {
				min-width: 0!important;
				display: table-cell!important;
			}
			.no-stack.two-up .col {
				width: 50%!important;
			}
			.no-stack.mixed-two-up .col.num4 {
				width: 33%!important;
			}
			.no-stack.mixed-two-up .col.num8 {
				width: 66%!important;
			}
			.no-stack.three-up .col.num4 {
				width: 33%!important;
			}
			.no-stack.four-up .col.num3 {
				width: 25%!important;
			}
      .mobile_hide {
        min-height: 0px!important;
        max-height: 0px!important;
        max-width: 0px!important;
        display: none!important;
        overflow: hidden!important;
        font-size: 0px!important;
      }
    }
  </style>
  <!--[if IE]><div class="ie-browser"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e2eace;width: 100%" cellpadding="0" cellspacing="0">
	<tbody>
	<tr style="vertical-align: top">
		<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e2eace;"><![endif]-->

    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <div align="center" class="img-container center  autowidth  fullwidth " style="padding-right: 0px;  padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px;line-height:0px;"><td style="padding-right: 0px; padding-left: 0px;" align="center"><![endif]-->
<div style="line-height:25px;font-size:1px">&#160;</div>  <img class="center  autowidth  fullwidth" align="center" border="0" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/20/rounder-up.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 600px" width="600">
<!--[if mso]></td></tr></table><![endif]-->
</div>

                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #FFFFFF;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:#FFFFFF;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <div align="center" class="img-container center  autowidth  " style="padding-right: 0px;  padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px;line-height:0px;"><td style="padding-right: 0px; padding-left: 0px;" align="center"><![endif]-->
  <img class="center  autowidth " align="center" border="0" src="https://i.imgur.com/FrVRrnL.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 250px" width="250">
<!--[if mso]></td></tr></table><![endif]-->
</div>

                  
                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
	<div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:150%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
		<div style="font-size:12px;line-height:18px;color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px;text-align: center"></p></div>	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #FFFFFF;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:#FFFFFF;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
		<div style="font-size:12px;line-height:14px;color:#0D0D0D;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 28px; line-height: 33px;"><strong><span style="line-height: 33px; font-size: 28px;">Hello ` + req.body.fname + `,<br></span></strong></span><br><span style="font-size: 28px; line-height: 33px;">Enrollment Successful</span></p></div>	
	<div style="color:#0D0D0D;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
                  
                    <div align="center" class="img-container center  autowidth  " style="padding-right: 0px;  padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px;line-height:0px;"><td style="padding-right: 0px; padding-left: 0px;" align="center"><![endif]-->
  <img class="center  autowidth " align="center" border="0" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/20/divider.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 316px" width="316">
<!--[if mso]></td></tr></table><![endif]-->
</div>

                  
                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
	<div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:150%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
		
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 10px;"><![endif]-->
	<div style="color:#0D0D0D;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:150%; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 10px;">	
		<div style="font-size:12px;line-height:18px;color:#0D0D0D;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px;text-align: center">You have successfully enrolled to the CAS Job Placements. To continue <br/> to the next procedure please pay ₹500 by clicking this link.

</p></div>	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
                  
                    
<div align="center" class="button-container center " style="padding-right: 10px; padding-left: 10px; padding-top:25px; padding-bottom:10px;">
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top:25px; padding-bottom:10px;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:46pt; v-text-anchor:middle; width:151pt;" arcsize="7%" strokecolor="#a8bf6f" fillcolor="#a8bf6f"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; font-size:16px;"><![endif]-->
    <div style="color: #ffffff; background-color: #a8bf6f; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; max-width: 202px; width: 172px;width: auto; border-top: 0px solid transparent; border-right: 0px solid transparent; border-bottom: 0px solid transparent; border-left: 0px solid transparent; padding-top: 15px; padding-right: 15px; padding-bottom: 15px; padding-left: 15px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; text-align: center; mso-border-alt: none;">
      <span style="font-size:16px;line-height:32px;">Make Payments</span>
    </div>
  <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
</div>

                  
                  
                    
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 30px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #525252;" class="block-grid three-up ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#525252;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:#525252;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="200" style=" width:200px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num4" style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    
<div align="center" style="padding-right: 0px; padding-left: 0px; padding-bottom: 0px;" class="">
  <div style="line-height:15px;font-size:1px">&#160;</div>
  <div style="display: table; max-width:131px;">
  <!--[if (mso)|(IE)]><table width="131" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse; padding-right: 0px; padding-left: 0px; padding-bottom: 0px;"  align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:131px;"><tr><td width="32" style="width:32px; padding-right: 5px;" valign="top"><![endif]-->
    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px">
      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        
      <div style="line-height:5px;font-size:1px">&#160;</div>
      </td></tr>
    </tbody></table>
      <!--[if (mso)|(IE)]></td><td width="32" style="width:32px; padding-right: 5px;" valign="top"><![endif]-->
    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px">
      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        
      <div style="line-height:5px;font-size:1px">&#160;</div>
      </td></tr>
    </tbody></table>
      <!--[if (mso)|(IE)]></td><td width="32" style="width:32px; padding-right: 0;" valign="top"><![endif]-->
    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 0">
      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        
      <div style="line-height:5px;font-size:1px">&#160;</div>
      </td></tr>
    </tbody></table>
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
  </div>
</div>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
              <!--[if (mso)|(IE)]></td><td align="center" width="200" style=" width:200px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num4" style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 20px; padding-bottom: 0px;"><![endif]-->
	<div style="color:#a8bf6f;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:120%; padding-right: 0px; padding-left: 0px; padding-top: 20px; padding-bottom: 0px;">	
		<div style="font-size:12px;line-height:14px;color:#a8bf6f;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px;text-align: center"><span style="color: rgb(255, 255, 255); font-size: 12px; line-height: 14px;"><span style="font-size: 12px; line-height: 14px; color: rgb(168, 191, 111);">CAS SHRC | Bridging Talents and Opportunities 
<br></p></div>	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
              <!--[if (mso)|(IE)]></td><td align="center" width="200" style=" width:200px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num4" style="max-width: 320px;min-width: 200px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 20px; padding-bottom: 0px;"><![endif]-->
	
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 600px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style=" width:600px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <div align="center" class="img-container center  autowidth  fullwidth " style="padding-right: 0px;  padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px;line-height:0px;"><td style="padding-right: 0px; padding-left: 0px;" align="center"><![endif]-->
  <img class="center  autowidth  fullwidth" align="center" border="0" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/20/rounder-dwn.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 600px" width="600">
<!--[if mso]></td></tr></table><![endif]-->
</div>

                  
                  
                    
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 30px;padding-left: 30px;padding-top: 30px;padding-bottom: 30px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
   <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
		</td>
  </tr>
  </tbody>
  </table>
  <!--[if (mso)|(IE)]></div><![endif]-->


</body></html>`;
							
                              sendMail.sendMail(req.body.email,html,'Successfully Enrolled');
                              
                                console.log("Course details");

                                let marking;
                                let duration;
                                let marks=[];

                                Course.find({_id:req.body.course_id})
                                .then(result => {
                                    if(result.length>0)
                                    {
                                        console.log(result[0].academic_term);
                                        duration=parseInt(result[0].duration);

                                        if(result[0].academic_term==="semister")
                                        {
                                            let divv=duration/6;

                                            for(let x=0;x<divv;x++)
                                            {
                                                marks.push("Semister "+x+1);

                                                const newGrade = new Grade({
                                                    student_id: student._id,
                                                    course_type: "Semister",
                                                    period_number: x+1,
                                                    grades:"",
                                                
                                                });

                                                newGrade.save();

                                            }

                                            console.log(marks)
                                        }
                                        else if(result[0].academic_term==="yearly")
                                        {
                                            let divv=duration/12;

                                            for(let x=0;x<divv;x++)
                                            {
                                                marks.push("Year "+x+1);

                                                const newGrade = new Grade({
                                                    student_id: student._id,
                                                    course_type: "Yearly",
                                                    period_number: x+1,
                                                    grades:"",
                                                
                                                });

                                                newGrade.save();
                                            }

                                            console.log(marks)
                                        }
                                        else if(result[0].academic_term==="trimly")
                                        {
                                            let divv=duration/3;

                                            for(let x=0;x<divv;x++)
                                            {
                                                marks.push("Trisemister " +x+1);

                                                const newGrade = new Grade({
                                                    student_id: student._id,
                                                    course_type: "Tri",
                                                    period_number: x+1,
                                                    grades:"",
                                                
                                                });

                                                newGrade.save();
                                            }

                                            console.log(marks)
                                        }
                                    }
                                    else
                                    {
                                        console.log("Course Not FInd")
                                    }
                                });

                                res.status(200).send(setting.status("Student Enrollment Successfully, Please Check your Mail", true, "Student Enrolled", student._id))
								console.log('Email sent: ' + info.response);						
						
						}
					
					
                        // if(student)
                          // {
                            // var transporter = nodemailer.createTransport({
                              // host: 'smtp.zoho.com',
                              // port: 465,
                              // secure: true,
                              // auth: {
                              // service: 'gmail',
                              // auth: {
                                // user: 'samplejobportal@gmail.com',
                                // pass: 'Job@1234'
                                // user: 'placements@casshrc.com',
                                // pass: 'QYFZcrqSG0YE'
                              // }
                            // });

                            // var mailOptions = {
                              // from: 'placements@casshrc.com',
                              // to: req.body.email,
                              // subject: 'Successfully Enrolled',
                              // html: `<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td><td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hi ` + req.body.fname + `,</p><p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">You have successfully enrolled to the CAS Job Placements. To continue to the next procedure please pay ₹500 by clicking this lik</p><table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="http://google.lk" target="_blank" style="display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;">Make Payments</a> </td></tr></tbody> </table> </td></tr></tbody> </table> 
							              // </td></tr></table> </td></tr></table> <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">CAS SHRC | Bridging Talents and Opportunities</span> <br>Don't like these emails? <a href="http://i.imgur.com/CScmqnj.gif" style="text-decoration: underline; color: #999999; font-size: 12px; text-align: center;">Unsubscribe</a>. </td></tr><tr> <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> </td></tr></table> </div></div></td><td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td></tr></table> </body>`
                            // };

                            // transporter.sendMail(mailOptions, function(error, info)
                            // {
                              // if (error)
                              // {
                                // console.log(error);
                              // } 
                              // else
                              // {
                                // res.status(200).send(setting.status("Student Enrollment Successfully, Please Check your Mail", true, "Student Enrolled", student._id))
                              // }
                            // });
                          // }
                      // })
					  // .catch(err => res.status(200).send(setting.status("Sorry! Try again", false, "Unable to create Enrollment", err)))


                        // })
                     });

                   })
				  
                })
            }
        })
	}
})
    }

    else
    {
        return res.status(200).send(setting.status("Role cannot be found", false, "Student role doesnot found", null))

    }
        })
})
 

 
// *** POST *** /api/users/userId *** Update student details ***
router.post("/:id", (req, res) => {
   
  const id = req.params.id;
  if(!id)
  {
    return res.status(200).send(setting.status("Studnet Id not found",false,"invalid id",null));
  }


  var validationResult = validationStudentUpdate.checkStudentUpdateValidation(req.body);

    // if (!validationResult.status)
    // {
    //     return res.send(validationResult);
    // }
    //   var enteredMobile = req.body.contact_no;

    //   //Mobile length validation
    // var mobileLength = Object.keys(req.body.contact_no).length; // Taking length

    // if(mobileLength == 10 && (enteredMobile.charAt(0)==0))
    // {
    //     splitNum = enteredMobile.substring(1);
    //     mobileToSave = '91'+ splitNum;
    //     console.log("Mobile starts with 0 : " + mobileToSave);
    // }

    // if(mobileLength == 9 )
    // {
    //     splitNum = enteredMobile;
    //     mobileToSave = '91'+ enteredMobile;
    //     console.log("Mobile starts without 0 : " + mobileToSave);
    // }

    // if(mobileLength == 11 && (enteredMobile.substring(0,2)==91))
    // {
    //     mobileToSave = enteredMobile;
    //     console.log("Mobile starts with 91 : " + mobileToSave);
    // }

    if(req.body.academic_from==="undefined" || req.body.academic_from==null || req.body.academic_from=='')
    {

    }else
    {
        if(req.body.academic_to==="undefined" || req.body.academic_to==null || req.body.academic_to=='')
        {
            return res.send({"msg":"Please select academic end year", "status":false, "description":"academic_to empty", "data":null});
        }else
        {
            if(parseInt(req.body.academic_from)>parseInt(req.body.academic_to))
            {
                return res.send({"msg":"invalid year selection", "status":false, "description":"academic_from > academic_to", "data":null});
            }

            if(parseInt(req.body.academic_from)<1950 ||parseInt(req.body.academic_from)>2200||parseInt(req.body.academic_to)<1950 ||parseInt(req.body.academic_to)>2200)
            {
                result = {"msg":"Year not valid", "status":false, "description":"year not valid", "data":null}
                return (result);
            }

        }
    }


    if(req.body.c_pin_code==="undefined" || req.body.c_pin_code==null || req.body.c_pin_code=='')
    {

    }else
    {
        var c_pinCodeValidation = Object.keys(req.body.c_pin_code).length; // Taking length
        console.log(c_pinCodeValidation)
        if(c_pinCodeValidation !== 6  )
        {
            return res.send({"msg":"Invalid current address pin code", "status":false, "description":"invalid c_pin_code", "data":null});
    
        }
    }

    if(req.body.p_pin_code==="undefined" || req.body.p_pin_code==null || req.body.p_pin_code=='')
    {

    }else
    {
        var p_pinCodeValidation = Object.keys(req.body.p_pin_code).length; // Taking length
        if(p_pinCodeValidation !== 6  )
        {
            return res.send({"msg":"Invalid permanent address pin code", "status":false, "description":"invalid p_pin_code", "data":null});
    
        }
    }

  Student.findOne({_id: id})
  .then(student => {
      if(!student)
      {
        setting.status("Student not found",false,"student not found", null)
      }
      else if (student)
      {
        
          Student.findByIdAndUpdate(id, {
                age : req.body.age,
                gender :req.body.gender,
                current_address : req.body.current_address,
                c_state : req.body.c_state,
                c_city : req.body.c_city,
                c_pin_code : req.body.c_pin_code,
                permanant_address : req.body.permanant_address,
                p_state : req.body.p_state,
                p_city : req.body.p_city,
                p_pin_code : req.body.p_pin_code,
                project : req.body.project,
                specific_academic_achivement : req.body.specific_academic_achivement,
                academic_from : req.body.academic_from,
                academic_to : req.body.academic_to,
                writen_introduction: req.body.writen_introduction,
                overall_grade:req.body.overall_grade,

               
                //written_test_result : req.body.written_test_result,
                
        }, {new: true})
              .then(student => {
                  res.json(setting.status("Student Updated", true, "updated", student));
                })
                .catch(err => {
                    res.json(setting.status("Student Not Found", false, "error", err));
                });
            }
            else
            {
                res.json(setting.status("Student Not Found", false, "error", err));
            }
        })
})


// *** POST *** /api/users/userId *** Update student details ***
router.post("/skillset/:id", (req, res) => {

    const id = req.params.id;
    if(!id)
    {
      return res.status(200).send(setting.status("Studnet Id not found",false,"invalid id",null));
    }

    if(!req.body.writen_introduction_answer)
    {
      return res.status(200).send(setting.status("Answer not found",false,"empty answer",null));
    }

    if(!req.body.writen_introduction_question)
    {
      return res.status(200).send(setting.status("Question not found",false,"question answer",null));
    }
  
    console.log(req.body);
  
    
    Student.findOne({_id: id})
    .then(student => {
        if(!student)
        {
          setting.status("Student not found",false,"student not found", null)
        }
        else if (student)
        {
          
            Student.findByIdAndUpdate(id, {
                 
                  writen_introduction_question : req.body.writen_introduction_question,
                  writen_introduction_answer : req.body.writen_introduction_answer,
                 
            }, {new: true})
                .then(student => {
                    res.json(setting.status("Student Updated", true, "updated", student));
                  })
                  .catch(err => {
                      res.json(setting.status("Student Not Found", false, "error", err));
                  });
              }
              else
              {
                  res.json(setting.status("Student Not Found", false, "error", err));
              }
        })
  })


  
// *** POST *** /api/users/userId *** Update student details ***
router.post("/written/:id", (req, res) => {

    const id = req.params.id;
    if(!id)
    {
      return res.status(200).send(setting.status("Studnet Id not found",false,"invalid id",null));
    }

    if(!req.body.writen_introduction)
    {
      return res.status(200).send(setting.status("Answer not found",false,"empty answer",null));
    }

    
    Student.findOne({_id: id})
    .then(student => {
        if(!student)
        {
          setting.status("Student not found",false,"student not found", null)
        }
        else if (student)
        {
          
            Student.findByIdAndUpdate(id, {
                 
                  writen_introduction: req.body.writen_introduction,
                 
            }, {new: true})
                .then(student => {
                    res.json(setting.status("Student Updated", true, "updated", student));
                  })
                  .catch(err => {
                      res.json(setting.status("Student Not Found", false, "error", err));
                  });
              }
              else
              {
                  res.json(setting.status("Student Not Found", false, "error", err));
              }
        })
  })


  // *** POST *** /api/users/userId *** Update student details ***
router.post("/change_status/:id", (req, res) => {

    const id = req.params.id;
    if(!id)
    {
      return res.status(200).send(setting.status("Studnet Id not found",false,"invalid id",null));
    }

    let status=req.body.status;
    
    Student.findOne({_id: id})
    .then(student => {
        if(!student)
        {
          setting.status("Student not found",false,"student not found", null)
        }
        else if (student)
        {

            let approved;
            if(status==="reject")
            {
                approved=false;
            }

            else if(status==="approved")
            {
                approved=true;
            }

          
            Student.findByIdAndUpdate(id, {
                 
                  is_approved: approved,
                 
            }, {new: true})
                .then(student => {
                    res.json(setting.status("Student Updated", true, "updated", student));
                  })
                  .catch(err => {
                      res.json(setting.status("Student Not Found", false, "error", err));
                  });
              }
              else
              {
                  res.json(setting.status("Student Not Found", false, "error", err));
              }
        })
  })


  // *** POST *** /api/users/userId *** Update student details ***
router.post("/video/:id",upload.single('video'), (req, res) => {

    const id = req.params.id;
    if(!id)
    {
      return res.status(200).send(setting.status("Studnet Id not found",false,"invalid id",null));
    }

    // console.log(req.file)
    // console.log(req.file.fieldname + '-'+id+'-' + Date.now())
    console.log(req.file.path)

    // if(!req.body.writen_introduction_answer)
    // {
    //   return res.status(200).send(setting.status("Answer not found",false,"empty answer",null));
    // }

    // if(!req.body.writen_introduction_question)
    // {
    //   return res.status(200).send(setting.status("Question not found",false,"question answer",null));
    // }
  
    console.log(req.file);

    var path;

    if(req.file.path===""||req.file.path==undefined||req.file.path==null)
    {
        path="";

    }else
    {
        //path=req.file.path ;

        var extt=req.file.mimetype;

        if(extt==="video/mp4")
        {
            path=req.file.path ;
        }else
        {
            return res.json(setting.status("Video format not support", false, "error", null));
        }
    }
  
    
    Student.findOne({_id: id})
    .then(student => {
        if(!student)
        {
          setting.status("Student not found",false,"student not found", null)
        }
        else if (student)
        {
          
            Student.findByIdAndUpdate(id, {
                 
                  video : path,
                 
          }, {new: true})
                .then(student => {
                    res.json(setting.status("Student Updated", true, "updated", student));
                  })
                  .catch(err => {
                      res.json(setting.status("Student Not Found", false, "error", err));
                  });
              }
              else
              {
                  res.json(setting.status("Student Not Found", false, "error", err));
              }
          })
  })


  // *** POST *** /api/users/userId *** Update student details ***
router.post("/attachment/:id",upload.single('attachment'), (req, res) => {

    const id = req.params.id;
    console.log("mime",req.file.mimetype)
    console.log("mano")
    if(!id)
    {
      return res.status(200).send(setting.status("Studnet Id not found",false,"invalid id",null));
    }

    var path;

    if(req.file.path===""||req.file.path==undefined||req.file.path==null)
    {
        path="";

    }else
    {
        var extt=req.file.mimetype;
        console.log(extt)

        if(extt==="application/pdf")
        {
            path=req.file.path ;
        }else
        {
            return res.json(setting.status("Marksheet not support", false, "error", null));
        }
    }
    
    Student.findOne({_id: id})
    .then(student => {
        if(!student)
        {
          setting.status("Student not found",false,"student not found", null)
        }
        else if (student)
        {
          
            Student.findByIdAndUpdate(id, {
                 
                  attachment : path
                 
          }, {new: true})
                .then(student => {
                    res.json(setting.status("Student Updated", true, "updated", student));
                  })
                  .catch(err => {
                      res.json(setting.status("Student Not Found", false, "error", err));
                  });
              }
              else
              {
                  res.json(setting.status("Student Not Found", false, "error", null));
              }
          })
  })


  // *** POST *** /api/users/userId *** Update student details ***
  router.post("/submit/:id", (req, res) => {

    const id = req.params.id;
   
    if(!id)
    {
      return res.status(200).send(setting.status("Studnet Id not found",false,"invalid id",null));
    }

    Student.findOne({_id: id})
    .then(student => {
        if(!student)
        {
          setting.status("Student not found",false,"student not found", null)
        }
        else if (student)
        {
          
            Student.findByIdAndUpdate(id, {
                 
                is_submited:true
                 
          }, {new: true})
                .then(student => {
                    res.json(setting.status("Student Updated", true, "updated", student));
                  })
                  .catch(err => {
                      res.json(setting.status("Student Not Found", false, "error", err));
                  });
              }
              else
              {
                  res.json(setting.status("Student Not Found", false, "error", null));
              }
          })
  })

// *** POST *** /api/users/userId *** Update student details ***
router.post("/payment_status/:id", (req, res) => {

  const id = req.params.id;
  
  //Find student email
  Student.findById(id, 'fname email', function (err, getMailById)
  {
	  
	  var randPassword = generator.generate({
			length: 8,
			numbers: true
		  });
		  
		  console.log(randPassword);
		  
		  //Hashing password 
		  var hashedPassword = bcrypt.hashSync(randPassword, 10); //Hashing password to unreadable
		  
  Student.findOne({_id: id})
  .then(student => {
      if(!student)
      {
        setting.status("Student not found", false, "student not found", null)
      }
      else if (student)
      {
          Student.findByIdAndUpdate(id, {payment_status: req.body.status, password: hashedPassword}, {new: true})
		  .then(student => {
			  // Not send this instead of send mail
              // res.json(setting.status("Student Payment Sucessfully", true, "updated", null));
			  
			 	  
			  
			  if(student)
                {
                    
                    var html= `<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> <title>Paid</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> Successfully paid and login ... </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Successfully Paid</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">Hi ` + getMailById.fname + `, You have successfully paid for your placements. The following is your login credentials. Change your password after you login.</p><p> <code> email : ` + getMailById.email + `</code> <br/><code> password : ` + randPassword + ` </code> </p></td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Login</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> <p style="margin: 0;">CAS SHRC | Bridging Talents and Opportunities</p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
                    
                    sendMail.sendMail(getMailById.email,html,'Successfully Paid')

                    return res.status(200).send(setting.status("Your payment successful, Please Check your Mail", true, "Student Paid", student._id))

                }
                
						  // if(student)
			  // {
				// var transporter = nodemailer.createTransport({
				  // for zoho
				 
				  // host: 'smtp.zoho.com',
				  // port: 465,
				  // secure: true,
				  // auth: {				  
					// user: 'placements@casshrc.com',
					// pass: 'QYFZcrqSG0YE'
				  // }
				  
				  
				  // for Gmail
				  // service: "Gmail",
					// auth: {
						// user: "samplejobportal@gmail.com",
						// pass: "Job@1234"
					// }
				// });

				// var mailOptions = {
				  // from: 'placements@casshrc.com',
				  // to: getMailById.email,
				  // subject: 'Successfully Paid',
				  // html: `<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> <title>Paid</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> A preheader is the short summary text that follows the subject line when an email is viewed in the inbox. </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Successfully Paid</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">Hi, You have successfully paid for your placements. The following is your login credentials. Change your password after you login.</p><p> <code> email : ` + getMailById.email + `</code> <code> password : ` + randPassword + ` </code> </p></td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Make Payments</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> <p style="margin: 0;">CAS SHRC | Bridging Talents and Opportunities</p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
				// };

				// transporter.sendMail(mailOptions, function(error, info)
				// {
				  // if (error)
				  // {
					// console.log(error);
				  // } 
				  // else
				  // {
					// res.status(200).send(setting.status("Your payment successful, Please Check your Mail", true, "Student Paid", student._id))
				  // }
				// });
			  // }	  
			  
          })
		  }
	  })
	  
	   .catch(err => {res.json(setting.status("Student Not Found", false, "error", err));});	   
  });					
})

// Todo : Pass token to get users details
// Todo : pagination
// *** GET *** /api/users/all *** Retrieve all users' basic details ***
router.get("/", middleware.checkToken, function (req, res, next)
{
    var ObjectId = require('mongodb').ObjectID;

    var aggregate = Student.aggregate();

    let searchCollege=[];
    let searchCourse=[];

    searchCollege=req.param('searchCollege');
    searchCourse=req.param('searchCourse');
    var approved=req.param('approved');
    var page_no = req.param('page');
    var searchName = req.param('searchName');
    var search = req.param('search');
    var searchEmail = req.param('searchEmail');
    var searchContact = req.param('searchContact');
    var paymentStatus = req.param('paymentStatus');
    


    aggregate.sort({"createdAt" : -1})//.match({"deleted":false})
            .lookup({ from: "colleges", localField: "college_id", foreignField: "_id",as: "college_doc"})
            .lookup({ from: "courses", localField: "course_id", foreignField: "_id",as: "course_doc"})
            .lookup({ from: "specializations", localField: "specialization_id_major", foreignField: "_id",as: "major_doc"})
            .lookup({ from: "specializations", localField: "specialization_id_minor", foreignField: "_id",as: "minor_doc"})
            .lookup({ from: "internships", localField: "_id", foreignField: "student_id",as: "internship_doc"})
            .project({password:0})
    if(searchCourse===null || searchCourse ===undefined|| searchCourse ==="")
    {
        
    }else
    {
        if(searchCourse.length>0)
        {
            let y=[];

            for(let x=0;x<searchCourse.length;x++)
            {
                y.push({"course_doc._id":ObjectId(searchCourse[x])})
            }

            console.log(y)

            aggregate.match({$or:y});
        }
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
                y.push({"college_doc._id":ObjectId(searchCollege[x])})
            }

            aggregate.match({$or:y});
        }
    }


    if(search===null || search ===undefined)
    {
        
    }else
    {
        aggregate.match({$or:[{"fname":{"$regex": search, "$options": "i"}},{"lname":{"$regex": search, "$options": "i"}}]});
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

    if(paymentStatus===null || paymentStatus ===undefined)
    {
        
    }else
    {
        aggregate.match({"payment_status": paymentStatus});
    }

    if(approved===null || approved ===undefined)
    {
        
    }else
    {
        if(approved==="approved")
        {
            aggregate.match({"is_approved":true});
        }
        else if(approved==="not_approved")
        {
            aggregate.match({"is_approved":false});
        }
        
    }
    
    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Student.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
        if(err) 
        {
            
            res.send(
    
                setting.status("Error",false,"error",err)

            );
        }
        else
        { 
        
            res.send(
        
                setting.status("Details'",true,"Data found",{pages:pageCount,count:count,pagesize:Page_cont.pagecontent,results})

            );
        
        }
    })    
});


// *** GET *** /api/users/{userId} *** Retrieve one user's basic details ***
router.get("/:id", middleware.checkToken, function (req, res, next)
{
  var ObjectId = require('mongodb').ObjectID;

  const id = req.params.id;
  if(!id)
  {
    return res.status(200).send(setting.status("Student Id not found",false,"invalid id",null));
  }

  let grade;
  Grade.find({student_id:id}).sort( { period_number: 1 } )
        .then(result => {
            console.log(result)
            grade=result;
        }); 

  var aggregate = Student.aggregate();
    aggregate
            .match({_id:ObjectId(id)})
            .lookup({ from: "colleges", localField: "college_id", foreignField: "_id",as: "college_doc"})
            .lookup({ from: "courses", localField: "course_id", foreignField: "_id",as: "course_doc"})
            .lookup({ from: "specializations", localField: "specialization_id_major", foreignField: "_id",as: "major_doc"})
            .lookup({ from: "specializations", localField: "specialization_id_minor", foreignField: "_id",as: "minor_doc"})
            .lookup({ from: "grades", localField: "_id", foreignField: "student_id",as: "grade_doc"})
            .lookup({ from: "internships", localField: "_id", foreignField: "student_id",as: "internship_doc"})


    var options = { page : 1, limit : setting.pagecontent}

    Student.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
        
        if(err) 
        {
            
            res.send(
    
                setting.status("Error",false,"error",err)

            );
        }
        else
        { 
            let percentage=100;
            if(results[0].fname==""||results[0].fname==undefined||results[0].fname==null)
            {
                percentage=percentage-5;
            }

            if(results[0].lname==""||results[0].lname==undefined||results[0].lname==null)
            {
                percentage=percentage-5;
            }

            if(results[0].gender==""||results[0].gender==undefined||results[0].gender==null)
            {
                percentage=percentage-5;
            }

            if(results[0].age==""||results[0].age==undefined||results[0].age==null)
            {
                percentage=percentage-5;
            }

            if(results[0].contact_no==""||results[0].contact_no==undefined||results[0].contact_no==null)
            {
                percentage=percentage-5;
            }

            if(results[0].email==""||results[0].email==undefined||results[0].email==null)
            {
                percentage=percentage-5;
            }

            if(results[0].current_address==""||results[0].current_address==undefined||results[0].current_address==null)
            {
                percentage=percentage-5;
            }

            if(results[0].permanant_address==""||results[0].permanant_address==undefined||results[0].permanant_address==null)
            {
                percentage=percentage-5;
            }

            if(results[0].project==""||results[0].project==undefined||results[0].project==null)
            {
                percentage=percentage-7;
            }

            if(results[0].writen_introduction_answer==""||results[0].writen_introduction_answer==undefined||results[0].writen_introduction_answer==null)
            {
                percentage=percentage-15;
            }

            if(results[0].video==""||results[0].video==undefined||results[0].video==null)
            {
                percentage=percentage-15;
            }



            if(results[0].college_doc.length==0)
            {
                percentage=percentage-7;
            }

            if(results[0].course_doc.length==0)
            {
                percentage=percentage-7;
            }

            if(results[0].grade_doc.length==0)
            {
                percentage=percentage-9;
            }

            //console.log(results[0].fname)
            res.send(
        
                setting.status("Details",true,"Data found",{percentage:percentage,grade_doc:grade,results})

            );
        
        }
    })  
});

router.post("/stu/login", (req, res) =>{

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

    Student.findOne({email: email}, function (err, user)
    {
        if (err)
            return res.send(
          
              setting.status("Try Again",false,"Error on server",err)
      
          );
        if (!user)
            return res.send(
          
              setting.status("Authentication false",false,"user not found",null)
      
          );


          if (user===null)
            return res.send(
          
              setting.status("User not find",false,"user not found",null)
      
          );

          console.log(user);
          console.log(req.body.password);
          console.log(user.password)
          

          var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
          if (!passwordIsValid)
                return res.send(
              
                  setting.status("Wrong Pasword",false,"password wrong",null)
          
              );

              let authority=[];
              let role='Student';

          Role_authority.find({role_id:user.role})//.populate('role_id')
          .then(result => {


              if(result.length>0)
              {
                //role=result[0].role_id.name;

                  for(var x=0;x<result.length;x++)
                  {
                      authority.push(result[x].authority)
                  }
              }else
              {
                  //return ("authority not found")
              }

            var token = jwt.sign({ id: user._id,name:user.fname,authority:authority,email:user.email,contact_no:user.contact_no,role:user.role,role_name:role  }, config.secretOrKey, {expiresIn: 86400});

            return res.send(
                
                  setting.status("Login success",true,"Authentication true",{"loginToken":token})        
                );
            });
    })


  });

router.post('/change_password/:id', middleware.checkToken,(req, res) => {

    
    var ObjectId = require('mongodb').ObjectID;
    var id=req.params.id;
	
	if(!ObjectId.isValid(id))
		{
			return res.send(
					
				setting.status(validation.FALSE,false,"incorrect id",null)

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

    Student.findOne({
            _id: id
        })
        .then(college => {
            if (college) {


                var passwordIsValid = bcrypt.compareSync(req.body.password, college.password);
                if (!passwordIsValid)
                return res.send(
                    
                        setting.status("Wrong Pasword",false,"password wrong",null)
                
                    );

                let old_password=college.password;
                let coming_password=req.body.password;
                let new_password=req.body.new_password;
                let conform_password=req.body.conform_password;

                let hashedPassword="";


                bcrypt.genSalt(10, (err, salt) =>
                    {
                        bcrypt.hash(new_password, salt, (err, hash) =>
                        {
                            if (err)
                            {
                                throw err;
                            }else
                            {
                                hashedPassword = hash;
                           

                    console.log("pass",hashedPassword)


                    if(new_password===conform_password)
                    {
                        Student.findOneAndUpdate(
                            { _id : id },
                            {$set:{
                            password:hashedPassword}},
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
                        
                    }else
                    {
                        return res.json(
		
                            setting.status("Password Not Match",false,"newpassword not match to conform password",null)
                    
                        );
                    }
                }
                                
                                

            })
    });
                

            } else {
                return res.json(
		
                    setting.status("Employer Not Found",false,"error",err)
            
                  );
            }
        })
})





//*******/users/:userId******DELETE******Delete an account***********
router.delete("/:id",  middleware.checkToken,function(req, res, next)
{

  var ObjectId = require('mongodb').ObjectID;
    var id = req.params.id;
    
    if(!ObjectId.isValid(id))
        {
            return res.send(setting.status("Invalid Id",false,"incorrect id",null));
        }
        
        Student.findByIdAndUpdate(id, {
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

router.get('/vacancy/:vacancy_id', middleware.checkToken,(req, res) => {

    console.log("vacancy view")

    // var result=middleware.function1("CAN_VIEW_UNIVERSITIES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var ObjectId = require('mongodb').ObjectID;
    var id=middleware.get_id();
    var vacancy_id=req.params.vacancy_id;
	
	if(!ObjectId.isValid(id))
		{
			return res.send(
					
				setting.status(validation.FALSE,false,"incorrect id",null)

			 );
		}
    var aggregate = Invite.aggregate();

    aggregate.match({"student_id":ObjectId(id)})
    .match({"vacancy_id":ObjectId(vacancy_id)})
   // .match({status:"active"})
    .lookup({ from: "vacancies", localField: "vacancy_id", foreignField: "_id",as: "vacancy_doc"})
    .lookup({ from: "employers", localField: "vacancy_doc.employer_id", foreignField: "_id",as: "employer_doc"});

    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : 6}

    Invite.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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

router.get('/:id/interview', middleware.checkToken,(req, res) => {

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
    var aggregate = Vacancy_Student.aggregate();

    aggregate.match({"student_id":ObjectId(id)})
    .lookup({ from: "vacancies", localField: "vacancy_id", foreignField: "_id",as: "vacancy_doc"})
    .lookup({ from: "employers", localField: "vacancy_doc.employer_id", foreignField: "_id",as: "employer_doc"});;

    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : 6}

    Vacancy_Student.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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
        Vacancy_Student.findOneAndUpdate(
            { student_id : student_id,vacancy_id:vacancy_id },
            {$set:{
            status:"active", is_accepted:true
        }},
        {runValidators: true, context: 'query' })
            
            .then(college =>{

                    var html;

                    Student.find({_id:student_id})
                    .then(result => {

                        var email=result[0].email;
                        var name=result[0].fname;

                        Vacancy.find({_id:vacancy_id}).populate("employer_id")
                        .then(result => {
                            console.log(result)
                            var job_title=result[0].job_title;
                            var email_employer=result[0].employer_id.email;

                        
                        html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
                        <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
                        Registered successfully. </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                        Interview accepted</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
                        Hi you have invite to the post of ` + job_title + `. 
                        </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                        GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
                        <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
                    
                            sendMail.sendMail(email_employer,html,'Job Interview Accepted')
                            
                        });
                    });   
                    
                res.json(

                    setting.status("Succesfully Accepted for interview",true,"invited",college)
            
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
        Vacancy_Student.findOneAndUpdate(
            { student_id : student_id,vacancy_id:vacancy_id },
            {$set:{
            status:"deactive",is_accepted:false
        }},
        {runValidators: true, context: 'query' })
        .then(college =>{
            var html;

                    Student.find({_id:student_id})
                    .then(result => {

                        var email=result[0].email;
                        var name=result[0].fname;

                        Vacancy.find({_id:vacancy_id}).populate("employer_id")
                        .then(result => {
                            console.log(result)
                            var job_title=result[0].job_title;
                            var email_employer=result[0].employer_id.email;

                        
                        html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
                        <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
                        Registered successfully. </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                        Interview reject</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
                        Hi you have invite to the post of ` + job_title + `. 
                        </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                        GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
                        <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
                    
                            sendMail.sendMail(email_employer,html,'Job Interview Reject')
                            
                        });
                    });   
                    
                res.json(

                    setting.status("Succesfully Accepted for interview",true,"invited",college)
            
                    );
        })
        .catch(err =>{
            console.log(err)
        })
    }
})


function reject_interview(vacancy_id,student_id)
{
    Vacancy_Student.remove({vacancy_id:vacancy_id,student_id:student_id})
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


router.post('/vacancy/:vacancy_id/student/:student_id/', middleware.checkToken,(req, res) => {

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
            //is_accepted:true,
            status:"2"
        }},
        {runValidators: true, context: 'query' })
        .then(college =>{
            console.log("sucess")
        
                    var html;

                    Student.find({_id:student_id})
                    .then(result => {

                        var email=result[0].email;
                        var name=result[0].fname;

                        Vacancy.find({_id:vacancy_id}).populate("employer_id")
                        .then(result => {
                            console.log(result)
                            var job_title=result[0].job_title;
                            var emp_email=result[0].employer_id.email;
                            var emp_name=result[0].employer_id.name;
                        
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
                            sendMail.sendMail(emp_email,html,'Interview rejected')
                    
                            
                        });

                        reject_invite(vacancy_id,student_id);

                   
                res.json(

                    setting.status("Succesfully Accepted for invite",true,"invited",college)
            
                    );
                })
                .catch(err =>{
                    console.log(err)
                })
        
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
            //is_accepted:false, 
            status:"3"
        }},
        {runValidators: true, context: 'query' })
        .then(college =>{

            var html;

                    Student.find({_id:student_id})
                    .then(result => {

                        var email=result[0].email;
                        var name=result[0].fname;

                        Vacancy.find({_id:vacancy_id}).populate("employer_id")
                        .then(result => {
                            console.log(result)
                            var job_title=result[0].job_title;
                            var emp_email=result[0].employer_id.email;
                            var emp_name=result[0].employer_id.name;

                        
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
                            sendMail.sendMail(emp_email,html,'Interview rejected')
                            
                        });

            reject_invite(vacancy_id,student_id);

            res.json(

                setting.status("Succesfully Reject",true,"reject",null)
    
            );
        })
        .catch(err =>{
            console.log(err)
        })

    })
    }
})

function reject_invite(vacancy_id,student_id)
{
    Invite.remove({vacancy_id:vacancy_id,student_id:student_id})
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

router.get('/:id/offer', middleware.checkToken,(req, res) => {

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
    var aggregate = Offer.aggregate();

    aggregate.match({"student_id":ObjectId(id)})
    .lookup({ from: "vacancies", localField: "vacancy_id", foreignField: "_id",as: "vacancy_doc"});

    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : 6}

    Vacancy_Student.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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
        Offer.findOneAndUpdate(
            { student_id : student_id,vacancy_id:vacancy_id },
            {$set:{
            status:"7"
        }},
        {runValidators: true, context: 'query' })
        .then(college =>{
            console.log("sucess")
        
                    var html;

                    Student.find({_id:student_id})
                    .then(result => {

                        var email=result[0].email;
                        var name=result[0].fname;

                        Vacancy.find({_id:vacancy_id}).populate("employer_id")
                        .then(result => {
                            console.log(result)
                            var job_title=result[0].job_title;
                            var email_employer=result[0].employer_id.email;

                        
                        html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
                        <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
                        Registered successfully. </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                        Offer accepted</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
                        Hi you have invite to the post of ` + job_title + `. 
                        </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                        GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
                        <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
                    
                            sendMail.sendMail(email_employer,html,'Offer Accepted')
                            
                        });

                     
                res.json(

                    setting.status("Succesfully Accepted for invite",true,"invited",college)
            
                    );
                })
                .catch(err =>{
                    console.log(err)
                })
        
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
        Offer.findOneAndUpdate(
            { student_id : student_id,vacancy_id:vacancy_id },
            {$set:{
            status:"6"
        }},
        {runValidators: true, context: 'query' })
        .then(college =>{

            var html;

                    Student.find({_id:student_id})
                    .then(result => {

                        var email=result[0].email;
                        var name=result[0].fname;

                        Vacancy.find({_id:vacancy_id}).populate("employer_id")
                        .then(result => {
                            console.log(result)
                            var job_title=result[0].job_title;
                            var email_employer=result[0].employer_id.email;

                        
                        html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
                        <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
                        Registered successfully. </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                        Offer rejected</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
                        Hi you have invite to the post of ` + job_title + `. 
                        </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                        GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
                        <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
                    
                            sendMail.sendMail(email_employer,html,'Offer Reject')
                            
                        });

            res.json(

                setting.status("Succesfully Reject",true,"reject",null)
    
            );
        })
        .catch(err =>{
            console.log(err)
        })

    })
    }
})


//************************************************************************************************************ */

router.get('/dashboard/page', middleware.checkToken,(req, res) => {

    var ObjectId = require('mongodb').ObjectID;
    var student_id=middleware.get_id();
	
	// if(!ObjectId.isValid(student_id))
	// 	{
	// 		return res.send(
					
	// 			setting.status("Incorrect Id",false,"incorrect id",null)

	// 		 );
    //     }
        
    var aggregate = Invite.aggregate();

    aggregate.match({"student_id":ObjectId(student_id)})
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

    var options = { page : page_no, limit : 6}

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













































router.get('/approvals', middleware.checkToken,(req, res) => {

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
        
    var status=req.param['status'];

    var aggregate = Invite.aggregate();

    aggregate.match({"student_id":ObjectId(id)})
    .lookup({ from: "vacancies", localField: "vacancy_id", foreignField: "_id",as: "vacancy_doc"})
    
    if(status===null || status ===undefined ||status==="")
    {
        
    }else
    {
        if(status==="pending")
        {
            aggregate.match({status:"pending"})
            .match({is_approved:true})
        }

        if(status==="approved")
        {
            aggregate.match({status:"approved"})
        }
    }


    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : 6}

    Invite.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
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



router.post('/change_status/vacancy/:vacancy_id/student/:student_id/', middleware.checkToken,(req, res) => {

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
            status:"active"
        }},
        {runValidators: true, context: 'query' })
        .then(college =>{
            console.log("sucess")
        
                    var html;

                    Student.find({_id:student_id})
                    .then(result => {

                        var email=result[0].email;
                        var name=result[0].fname;

                        Vacancy.find({_id:vacancy_id}).populate("employer_id")
                        .then(result => {
                            console.log(result)
                            var job_title=result[0].job_title;
                            var email_employer=result[0].employer_id.email;

                        
                        html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
                        <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
                        Registered successfully. </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                        Offer accepted</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
                        Hi you have invite to the post of ` + job_title + `. 
                        </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                        GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
                        <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
                    
                            sendMail.sendMail(email_employer,html,'Offer Accepted')
                            
                        });

                     
                res.json(

                    setting.status("Succesfully Accepted for invite",true,"invited",college)
            
                    );
                })
                .catch(err =>{
                    console.log(err)
                })
        
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
        Offer.findOneAndUpdate(
            { student_id : student_id,vacancy_id:vacancy_id },
            {$set:{
            status:"deactive"
        }},
        {runValidators: true, context: 'query' })
        .then(college =>{

            var html;

                    Student.find({_id:student_id})
                    .then(result => {

                        var email=result[0].email;
                        var name=result[0].fname;

                        Vacancy.find({_id:vacancy_id}).populate("employer_id")
                        .then(result => {
                            console.log(result)
                            var job_title=result[0].job_title;
                            var email_employer=result[0].employer_id.email;

                        
                        html=`<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> 
                        <title>Registed</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
                        Registered successfully. </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> 
                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                        Offer rejected</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">
                        Hi you have invite to the post of ` + job_title + `. 
                        </td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                        GO TO APPLICATION</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> 
                        <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
                    
                            sendMail.sendMail(email_employer,html,'Offer Reject')
                            
                        });

            res.json(

                setting.status("Succesfully Reject",true,"reject",null)
    
            );
        })
        .catch(err =>{
            console.log(err)
        })

    })
    }
})

router.get('/notification/all', middleware.checkToken,(req, res) => {

    var ObjectId = require('mongodb').ObjectID;
    var student_id=middleware.get_id();
	
    var aggregate = Notification.aggregate();

    let vacancy=req.param('vacancy');
    let status=req.param('status');

    aggregate
    .match({"student_id":ObjectId(student_id)})
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

        //change_status(vacancy);

    }
    
    let page_no=req.params.page;                

    if(page_no==0)
    {
        res.send(
        
            setting.status("page error",false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : 6}

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

function reset_student(email)
{
   
}

function reset_admin(email)
{
    
}




// *** POST *** /api/users/userId *** Update student details ***
router.post("/role/forgetpassword/", (req, res) => {

    console.log("forget passworddldljhkdhkjhfdkj");

    if(req.body.email==undefined || req.body.email==null || req.body.email=='') 
    {
        return res.send(
        
            setting.status("Email cannot be empty'",false,"email is empty",null)

        );
    }
    
    const email = req.body.email;
    const role = req.body.role;

    if(role==="employer")
    {
        console.log("employer ",email);
    
        Employer.find({email:email}, function (err, getMailById)
        {
            
            var randPassword = generator.generate({
                  length: 8,
                  numbers: true
                });
                
                console.log(randPassword);
                
                //Hashing password 
                var hashedPassword = bcrypt.hashSync(randPassword, 10); //Hashing password to unreadable
    
                console.log(getMailById)
    
        if(getMailById.length>0){
                
        Employer.findOne({_id: getMailById[0]._id})
        .then(student => {
            if(!student)
            {
                return res.send(
            
                    setting.status("Employer not found",false,"employer not found",null)
        
                );
    
            }
            else if (student)
            {
                Employer.findByIdAndUpdate(getMailById[0]._id, {password: hashedPassword}, {new: true})
                .then(student => {
                                   
                    if(student)
                      {
                          
                          var html= `<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> <title>Paid</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> Reset password succesfully ... </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Successfully Reset Password</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">Hi ` + getMailById[0].name + `, You have successfully reset your passwod.</p><p> <code> email : ` + getMailById[0].email + `</code> <br/><code> password : ` + randPassword + ` </code> </p></td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Login</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> <p style="margin: 0;">CAS SHRC | Bridging Talents and Opportunities</p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
                          
                          sendMail.sendMail(getMailById[0].email,html,'Successfully Reset password')
      
                          return res.status(200).send(setting.status("Your password send successful, Please Check your Mail", true, "reset", null))
      
                      }                
                })
                }
            })
    
        }else
        {
            return res.send(setting.status("Employer Not Found", false, "error", err));
        }   
        });	
    }

    else if(role==="student")
    {
        Student.find({email:email}, function (err, getMailById)
        {
            
            var randPassword = generator.generate({
                  length: 8,
                  numbers: true
                });
                
                console.log(randPassword);
                
                //Hashing password 
                var hashedPassword = bcrypt.hashSync(randPassword, 10); //Hashing password to unreadable
    
        if(getMailById.length>0){
                
        Student.findOne({_id: getMailById[0]._id})
        .then(student => {
            if(!student)
            {
                return res.send(
            
                    setting.status("Student not found",false,"student not found",null)
        
                );
    
            }
            else if (student)
            {
                Student.findByIdAndUpdate(getMailById[0]._id, {password: hashedPassword}, {new: true})
                .then(student => {
                                   
                    if(student)
                      {
                          
                          var html= `<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> <title>Paid</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> Reset password succesfully ... </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Successfully Reset Password</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">Hi ` + getMailById[0].fname + `, You have successfully reset your passwod.</p><p> <code> email : ` + getMailById[0].email + `</code> <br/><code> password : ` + randPassword + ` </code> </p></td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Login</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> <p style="margin: 0;">CAS SHRC | Bridging Talents and Opportunities</p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
                          
                          sendMail.sendMail(getMailById[0].email,html,'Successfully Reset password')
      
                          return res.status(200).send(setting.status("Your password send successful, Please Check your Mail", true, "Student Paid", null))
      
                      }                
                })
                }
            })
            
        }else
        {
            return res.send(setting.status("Student Not Found", false, "error", err));
        }
        });	
    }

    else if(role==="admin")
    {
        User.find({email:email}, function (err, getMailById)
    {
        
        var randPassword = generator.generate({
              length: 8,
              numbers: true
            });
            
            console.log(randPassword);
            
            //Hashing password 
            var hashedPassword = bcrypt.hashSync(randPassword, 10); //Hashing password to unreadable

    if(getMailById.length>0){
            
    User.findOne({_id: getMailById[0]._id})
    .then(student => {
        if(!student)
        {
            return res.send(
        
                setting.status("Student not found",false,"student not found",null)
    
            );

        }
        else if (student)
        {
            User.findByIdAndUpdate(getMailById[0]._id, {password: hashedPassword}, {new: true})
            .then(student => {
                               
                if(student)
                  {
                      
                      var html= `<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="x-ua-compatible" content="ie=edge"> <title>Paid</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */ @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}</style></head><body style="background-color: #e9ecef;"> <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> Reset password succesfully ... </div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"> <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Successfully Reset Password</h1> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"> <p style="margin: 0;">Hi ` + getMailById[0].fname + `, You have successfully reset your passwod.</p><p> <code> email : ` + getMailById[0].email + `</code> <br/><code> password : ` + randPassword + ` </code> </p></td></tr><tr> <td align="left" bgcolor="#ffffff"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" bgcolor="#ffffff" style="padding: 12px;"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Login</a> </td></tr></table> </td></tr></table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" bgcolor="#e9ecef" style="padding: 24px;"><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"> <tr> <td align="center" valign="top" width="600"><![endif]--> <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"> <tr> <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"> <p style="margin: 0;">CAS SHRC | Bridging Talents and Opportunities</p></td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </body></html>`
                      
                      sendMail.sendMail(getMailById[0].email,html,'Successfully Reset password')
  
                      return res.status(200).send(setting.status("Your password send successful, Please Check your Mail", true, "Student Paid", null))
  
                  }                
            })
            }
        })
    }else
    {
        return res.send(setting.status("User Not Found", false, "error", err));
    }   
    });	
    }


    
    //Find student email
    				
  })



module.exports = router;
