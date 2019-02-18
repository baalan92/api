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
        
    if(body.duration==undefined || body.duration==null || body.duration=='') 
		{
            result = {"msg":"Duration cannot be empty", "status":false, "description":"duration is empty", "data":null}
			return (result);
			
    }

    if(parseInt(body.duration)<0)
    {
      result = {"msg":"Invalid duration", "status":false, "description":"duration <0", "data":null}
			return (result);
    }

    if(body.marking_criteria==undefined || body.marking_criteria==null || body.marking_criteria=='') 
		{
            result = {"msg":"Marking criteria cannot be empty", "status":false, "description":"marking_criteria is empty", "data":null}
			return (result);
			
        }

    if(body.academic_term==undefined || body.academic_term==null || body.academic_term=='') 
		{
            result = {"msg":"Academic term cannot be empty", "status":false, "description":"academic_term is empty", "data":null}
			return (result);
			
        }

    if(body.list.length == 0) 
		{
            result = {"msg":"Please select specialization", "status":false, "description":"specialization(list) is empty", "data":null}
			return (result);
			
        }

        result={"status":true}
        return result;
}

module.exports.CheckValidation = CheckValidation;