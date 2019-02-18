const express = require('express');
const isEmpty = require('./is-empty');
const setting = require("../validation/settings");

let result;
function checkLoginValidation(body)
  {

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



    result = {"status":true}
    return result;
}

module.exports.checkLoginValidation = checkLoginValidation;