const express = require('express');
const isEmpty = require('./is-empty');
const setting = require("../validation/settings");

let result;
function checkRegisterValidation(body)
  {
    if(isEmpty(body.fname)) 
    {
        result = {"msg":"First name cannot be empty", "status":false, "description":"fname is empty", "data":null}
        return (result);
    }

    if(isEmpty(body.lname)) 
    {
        result = {"msg":"Last name cannot be empty", "status":false, "description":"lname is empty", "data":null}
        return (result);
    }

    if(isEmpty(body.email)) 
    {
        result = {"msg":"Email cannot be empty", "status":false, "description":"email is empty", "data":null}
        return (result);
    }

    if(!setting.CheckMail(body.email))
    {
        result = {"msg":"Invalid Email Address", "status":false, "description":"email format wrong", "data":null}
        return (result);
    }

    if(isEmpty(body.password)) 
    {
        result = {"msg":"Password cannot be empty", "status":false, "description":"password is empty", "data":null}
        return (result);
    }

    if(isEmpty(body.password2)) 
    {
        result = {"msg":"Confirm Password cannot be empty", "status":false, "description":"password2 is empty", "data":null}
        return (result);
    }

    if(body.password !== body.password2) 
    {
        result = {"msg":"Passwords cannot match", "status":false, "description":"both should match", "data":null}
        return (result);
    }
    
    if(isEmpty(body.contact_no)) 
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

    result = {"status":true}
    return result;
}

module.exports.checkRegisterValidation = checkRegisterValidation;