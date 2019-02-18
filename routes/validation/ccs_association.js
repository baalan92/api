const express = require('express');
const router = express.Router();
//const passport = require('passport');
//Load Input Validation
const setting=require("../return_msg/setting");

let result;
function CheckValidation(body)
  {
    
    if(body.college_id==undefined || body.college_id==null || body.college_id=='') 
		{
            result = {"msg":"College id cannot be empty", "status":false, "description":"college_id is empty", "data":null}
			return (result);
			
        }
    
    if(body.course_id==undefined || body.course_id==null || body.course_id=='') 
		{
            result = {"msg":"Course id cannot be empty", "status":false, "description":"course_id is empty", "data":null}
			return (result);
			
        }

    if(body.specialisation_id==undefined || body.specialisation_id==null || body.specialisation_id=='') 
		{
            result = {"msg":"Specialisation id cannot be empty", "status":false, "description":"specialisation_id is empty", "data":null}
			return (result);
			
        }

        result={"status":true}
        return result;
}

module.exports.CheckValidation = CheckValidation;