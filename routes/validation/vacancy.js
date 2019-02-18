const express = require('express');
const router = express.Router();
//const passport = require('passport');
//Load Input Validation
const setting=require("../return_msg/setting");
var validurl=require('valid-url');


let result;
function CheckValidation(body)
  {
    
    if(body.job_title==undefined || body.job_title==null || body.job_title=='') 
		{
            result = {"msg":"Job title cannot be empty", "status":false, "description":"job_title is empty", "data":null}
			return (result);
			
        }
    
    if(body.number==undefined || body.number==null || body.number=='') 
		{
            result = {"msg":"Number cannot be empty", "status":false, "description":"number is empty", "data":null}
			return (result);
			
    }
         

        result={"status":true}
        return result;
}

module.exports.CheckValidation = CheckValidation;