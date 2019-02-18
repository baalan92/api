const express = require('express');
const router = express.Router();
//const passport = require('passport');
//Load Input Validation
const setting=require("../return_msg/setting");

let result;
function CheckValidation(body)
  {
    
    if(body.name==undefined || body.name==null || body.name=='') 
		{
        result = {"msg":"Name cannot be empty", "status":false, "description":"name is empty", "data":null}
			  return (result);
			
    }
    
    if(body.code==undefined || body.code==null || body.code=='') 
		{
        result = {"msg":"Code cannot be empty", "status":false, "description":"code is empty", "data":null}
			  return (result);
			
    }

    if(body.status==undefined || body.status==null || body.status=='') 
		{
        result = {"msg":"Status cannot be empty", "status":false, "description":"status is empty", "data":null}
			  return (result);
			
    }

        result={"status":true}
        return result;
}

module.exports.CheckValidation = CheckValidation;