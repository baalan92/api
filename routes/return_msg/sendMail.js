const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
let middleware = require('../../validation/middleware');
var nodemailer = require('nodemailer');

//Load Input Validation


function sendMail(to, msg, subject)    //function sendMail(to,msg,subject,heading)
{

  // html=`<!DOCTYPE html>
  // <html>
     // <head>
        // <meta charset="utf-8">
        // <meta http-equiv="x-ua-compatible" content="ie=edge">
        // <title>Registed</title>
        // <meta name="viewport" content="width=device-width, initial-scale=1">
        // <style type="text/css"> /** * Google webfonts. Recommended to include the .woff version for cross-client compatibility. */
           // @media screen{@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 400; src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');}@font-face{font-family: 'Source Sans Pro'; font-style: normal; font-weight: 700; src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');}}/** * Avoid browser level font resizing. * 1. Windows Mobile * 2. iOS / OSX */ body, table, td, a{-ms-text-size-adjust: 100%; /* 1 */ -webkit-text-size-adjust: 100%; /* 2 */}/** * Remove extra space added to tables and cells in Outlook. */ table, td{mso-table-rspace: 0pt; mso-table-lspace: 0pt;}/** * Better fluid images in Internet Explorer. */ img{-ms-interpolation-mode: bicubic;}/** * Remove blue links for iOS devices. */ a[x-apple-data-detectors]{font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important;}/** * Fix centering issues in Android 4.4. */ div[style*="margin: 16px 0;"]{margin: 0 !important;}body{width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important;}/** * Collapse table borders to avoid space between cells. */ table{border-collapse: collapse !important;}a{color: #1a82e2;}img{height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none;}
        // </style>
     // </head>
     // <body style="background-color: #e9ecef;">
        // <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;"> 
           // Registered successfully. 
        // </div>
        // <table border="0" cellpadding="0" cellspacing="0" width="100%">
           // <tr>
              // <td align="center" bgcolor="#e9ecef">
                 // <!--[if (gte mso 9)|(IE)]> 
                 // <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    // <tr>
                       // <td align="center" valign="top" width="600">
                          // <![endif]--> 
                          // <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                             // <tr>
                                // <td align="center" valign="top" style="padding: 36px 24px;"> <a href="https://google.com" target="_blank" style="display: inline-block;"> <img src="http://172.104.40.142:3000/img/brand/logo-white.png" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: px;"> </a> </td>
                             // </tr>
                          // </table>
                          // <!--[if (gte mso 9)|(IE)]> 
                       // </td>
                    // </tr>
                 // </table>
                 // <![endif]--> 
              // </td>
           // </tr>
           // <tr>
              // <td align="center" bgcolor="#e9ecef">
                 // <!--[if (gte mso 9)|(IE)]> 
                 // <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    // <tr>
                       // <td align="center" valign="top" width="600">
                          // <![endif]--> 
                          // <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                             // <tr>
                                // <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                                   // <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                                      // heading
                                   // </h1>
                                // </td>
                             // </tr>
                          // </table>
                          // <!--[if (gte mso 9)|(IE)]> 
                       // </td>
                    // </tr>
                 // </table>
                 // <![endif]--> 
              // </td>
           // </tr>
           // <tr>
              // <td align="center" bgcolor="#e9ecef">
                 // <!--[if (gte mso 9)|(IE)]> 
                 // <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    // <tr>
                       // <td align="center" valign="top" width="600">
                          // <![endif]--> 
                          // <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                             // <tr>
                                // <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                   // <p style="margin: 0;">
                                      // Hi . 
                                // </td>
                             // </tr>
                             // <tr>
                                // <td align="left" bgcolor="#ffffff">
                                   // <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                      // <tr>
                                         // <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                            // <table border="0" cellpadding="0" cellspacing="0">
                                               // <tr>
                                                  // <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;"> <a href="https://google.com" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                                     // GO TO APPLICATION</a> 
                                                  // </td>
                                               // </tr>
                                            // </table>
                                         // </td>
                                      // </tr>
                                   // </table>
                                // </td>
                             // </tr>
                          // </table>
                          // <!--[if (gte mso 9)|(IE)]> 
                       // </td>
                    // </tr>
                 // </table>
                 // <![endif]--> 
              // </td>
           // </tr>
           // <tr>
              // <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                 // <!--[if (gte mso 9)|(IE)]> 
                 // <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    // <tr>
                       // <td align="center" valign="top" width="600">
                          // <![endif]--> 
                          // <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                             // <tr>
                                // <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                                   // <p style="margin: 0;"><b>CAS SHRC | Bridging Talents and Opportunities</b></p>
                                // </td>
                             // </tr>
                          // </table>
                          // <!--[if (gte mso 9)|(IE)]> 
                       // </td>
                    // </tr>
                 // </table>
                 // <![endif]--> 
              // </td>
           // </tr>
        // </table>
     // </body>
  // </html>`


  // Hi ` + name + `, you have invite to the post of ` + job_title + `. 84
    

  var transporter = nodemailer.createTransport({
 //  service: 'gmail',
 //  auth: {
	// user: 'samplejobportal@gmail.com',
	// pass: 'Job@1234'
 //  }

 // host: 'smtp.zoho.com',
    // port: 465,
    // secure: true,
    // auth: {
      // user: 'placements@casshrc.com',
      // pass: 'WIaDCmrBDuvM'
    // }
// }); 

host: 'us2.smtp.mailhostbox.com',
    port: 25,
    secure: false,
    auth: {
      user: 'alliances@primecareers.co.in',
      pass: 'yg^^QPR0'
    }
});

var mailOptions = {
  from: 'alliances@primecareers.co.in',
  // from: 'placements@casshrc.com',
  to:to,
  subject: subject,
  html: msg,
  // html: `<html><body>This is Sakthy</body></html>`,
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
	console.log(error);
  } 
})

}

module.exports.sendMail = sendMail;