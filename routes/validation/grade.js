const express = require('express');
const router = express.Router();
//const passport = require('passport');
//Load Input Validation
const setting=require("../return_msg/setting");
var validurl=require('valid-url');


let result;
function CheckValidation(body)
  {
    
    if(body.student_id==undefined || body.student_id==null || body.student_id=='') 
		{
            result = {"msg":"Student cannot be empty", "status":false, "description":"student_id is empty", "data":null}
			return (result);
			
        }
    
    if(body.course_type==undefined || body.course_type==null || body.course_type=='') 
		{
            result = {"msg":"Course Type cannot be empty", "status":false, "description":"course_type is empty", "data":null}
			return (result);
			
        }
        
    if(body.period_number==undefined || body.period_number==null || body.period_number=='') 
		{
            result = {"msg":"Period Number cannot be empty", "status":false, "description":"period_number is empty", "data":null}
			return (result);
			
        }

    if(body.grades==undefined || body.grades==null || body.grades=='') 
		{
            result = {"msg":"Grades cannot be empty", "status":false, "description":"grades is empty", "data":null}
			return (result);
			
        }

        result={"status":true}
        return result;
}

module.exports.CheckValidation = CheckValidation;