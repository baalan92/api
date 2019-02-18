const express = require('express');
const router = express.Router();
//const passport = require('passport');
//Load Input Validation
const setting=require("../return_msg/setting");


let result;
function CheckValidation(body)
  {
    
    if(body.employer==undefined || body.employer==null || body.employer=='') 
		{
            result = {"msg":"Employer cannot be empty", "status":false, "description":"employer is empty", "data":null}
			return (result);
			
        }
    
    if(body.internship_duration==undefined || body.internship_duration==null || body.internship_duration=='') 
		{
            result = {"msg":"Internship Duration cannot be empty", "status":false, "description":"internship_duration is empty", "data":null}
			return (result);
			
    }

    if(body.project==undefined || body.project==null || body.project=='') 
		{
            result = {"msg":"Project cannot be empty", "status":false, "description":"project is empty", "data":null}
			return (result);
			
    }
     
    result={"status":true}
        return result;
}

module.exports.CheckValidation = CheckValidation;