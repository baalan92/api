const express = require('express');
const router = express.Router();
//const passport = require('passport');
//Load Input Validation
const setting=require("../return_msg/setting");
var validurl=require('valid-url');


let result;
function CheckValidation(body)
  {
    
    if(body.name==undefined || body.name==null || body.name=='') 
		{
            result = {"msg":"Name cannot be empty", "status":false, "description":"name is empty", "data":null}
			return (result);
			
        }
    
    if(body.contact_no==undefined || body.contact_no==null || body.contact_no=='') 
		{
            result = {"msg":"Contact cannot be empty", "status":false, "description":"contact_no is empty", "data":null}
			return (result);
			
        }
        
    if(!setting.CheckMobile(body.contact_no))
        {
            result = {"msg":"Invalid Contact Number", "status":false, "description":"Number only", "data":null}
			return (result);
           
        }

     var mobileLength = Object.keys(body.contact_no).length; // Taking length
    if(mobileLength < 10 )
        {
            result = {"msg":"Invalid Number Length minimum 10", "status":false, "description":"invalid number", "data":null}
			return (result);
            
        }

    if(body.address==undefined || body.address==null || body.address=='') 
		{
            result = {"msg":"Address cannot be empty", "status":false, "description":"address is empty", "data":null}
			return (result);
			
        }

    if(body.email==undefined || body.email==null || body.email=='') 
		{
            result = {"msg":"Email cannot be empty", "status":false, "description":"email is empty", "data":null}
			return (result);
			
        }

    if(!setting.CheckMail(body.email))
        {
            result = {"msg":"Invalid Email Address", "status":false, "description":"wrong email", "data":null}
			return (result);
           
        }

    if(body.year==undefined || body.year==null || body.year=='') 
		{
            result = {"msg":"Year cannot be empty", "status":false, "description":"year is empty", "data":null}
			return (result);
			
        }

    if(parseInt(body.year)<1950 ||parseInt(body.year)>2200)
        {
            result = {"msg":"Year not valid", "status":false, "description":"year not valid", "data":null}
            return (result);
        }

    if(body.website==undefined || body.website==null || body.website=='') 
		{
            result = {"msg":"Website cannot be empty", "status":false, "description":"website is empty", "data":null}
			return (result);
			
        }


        let num=body.website;

        function validateIsNum(num)
        {
            var pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
            return pattern.test(num);
        }
    
        if (!validateIsNum(num))
        {
            result = {"msg":"Invalid URL", "status":false, "description":"website url wrong", "data":null}
            return (result);
        }else
        {
            result={"status":true}
            return result;
        }
}

module.exports.CheckValidation = CheckValidation;