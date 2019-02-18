const express = require('express');
const isEmpty = require('./is-empty');
const setting = require("../validation/settings");

let result;
function checkEnrollValidation(body)
  {
  console.log(body.fname);
    if(body.fname==="undefined" || body.fname==null || body.fname=='') 
    {
        result = {"msg":"First name cannot be empty", "status":false, "description":"fname is empty", "data":null}
        return (result);
    }

    if(body.lname==="undefined" || body.lname==null || body.lname=='') 
    {
        result = {"msg":"Last name cannot be empty", "status":false, "description":"lname is empty", "data":null}
        return (result);
    }

    if(body.email==="undefined" || body.email==null || body.email=='') 
    {
        result = {"msg":"Email cannot be empty", "status":false, "description":"email is empty", "data":null}
        return (result);
    }

    if(!setting.CheckMail(body.email))
    {
        result = {"msg":"Invalid Email Address", "status":false, "description":"email format wrong", "data":null}
        return (result);
    }

    if(body.contact_no==="undefined" || body.contact_no==null || body.contact_no=='') 
    {
        result = {"msg":"Contact number cannot be empty", "status":false, "description":"contact_no is empty", "data":null}
        return (result);
    }

    if(!setting.CheckMobile(body.contact_no))
    {
        result = {"msg":"Enter Number Only", "status":false, "description":"Number only", "data":null}
        return (result);
    }

    var mobileLength = Object.keys(body.contact_no).length; // Taking length
    if(mobileLength < 10 )
    {
        result = {"msg":"Invalid Contact number", "status":false, "description":"contct_no may less than 10 in length", "data":null}
        return (result);
    }

    if(body.college_id==="undefined" || body.college_id==null || body.college_id=='') 
    {
        result = {"msg":"College cannot be empty", "status":false, "description":"college_id is empty", "data":null}
        return (result);
    }

    if(body.course_id==="undefined" || body.course_id==null || body.course_id=='') 
    {
        result = {"msg":"Course cannot be empty", "status":false, "description":"course_id is empty", "data":null}
        return (result);
    }

    if(body.course_id==="undefined" || body.course_id==null || body.course_id=='') 
    {
        result = {"msg":"Course cannot be empty", "status":false, "description":"course_id is empty", "data":null}
        return (result);
    }

    if(body.specialization_id_major==="undefined" || body.specialization_id_major==null || body.specialization_id_major=='') 
    {
        result = {"msg":"Specialization Major cannot be empty", "status":false, "description":"specialization_id_major is empty", "data":null}
        return (result);
    }

    if(body.specialization_id_minor==="undefined" || body.specialization_id_minor==null || body.specialization_id_minor=='') 
    {
        // result = {"msg":"Specialization Minor cannot be empty", "status":false, "description":"specialization_id_minor is empty", "data":null}
        // return (result);
    }
    else
    {
        if(body.specialization_id_minor===body.specialization_id_major)
            {
                result = {"msg":"Specialization cannot be same", "status":false, "description":"same id", "data":null}
                return (result);
            }

    }

    

    result = {"status":true}
    return result;
}

module.exports.checkEnrollValidation = checkEnrollValidation;