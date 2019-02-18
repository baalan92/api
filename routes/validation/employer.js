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

    if(body.address==undefined || body.address==null || body.address=='') 
		{
            result = {"msg":"Address cannot be empty", "status":false, "description":"address is empty", "data":null}
			return (result);
			
        }

    if(body.state==undefined || body.state==null || body.state=='') 
		{
            result = {"msg":"State cannot be empty", "status":false, "description":"state is empty", "data":null}
			return (result);
			
        }

    if(body.city==undefined || body.city==null || body.city=='') 
		{
            result = {"msg":"City cannot be empty", "status":false, "description":"city is empty", "data":null}
			return (result);
			
        }

    if(body.pin_code==undefined || body.pin_code==null || body.pin_code=='') 
        {
            result = {"msg":"Pincode cannot be empty", "status":false, "description":"pin_code is empty", "data":null}
			return (result);
    
        }else
        {
            var c_pinCodeValidation = Object.keys(body.pin_code).length; // Taking length
            console.log(c_pinCodeValidation)
            if(c_pinCodeValidation !== 6  )
            {
                result = {"msg":"Invalid Pincode", "status":false, "description":"invalid pin_code", "data":null}
                return (result);
            
            }
        }

    if(body.hr_name==undefined || body.hr_name==null || body.hr_name=='') 
		{
            result = {"msg":"Human Resource name cannot be empty", "status":false, "description":"hr_name is empty", "data":null}
			return (result);
			
        }

    if(body.hr_email==undefined || body.hr_email==null || body.hr_email=='') 
		{
            result = {"msg":"Human Resource cannot be empty", "status":false, "description":"hr_email is empty", "data":null}
			return (result);
			
        }

    if(!setting.CheckMail(body.hr_email))
        {
            result = {"msg":"Invalid Email Address", "status":false, "description":"wrong email", "data":null}
			return (result);
           
        }

    if(body.hr_contact_no==undefined || body.hr_contact_no==null || body.hr_contact_no=='') 
		{
            result = {"msg":"Human Resource contact no cannot be empty", "status":false, "description":"hr_contact_no is empty", "data":null}
			return (result);
			
        }

    if(!setting.CheckMobile(body.hr_contact_no))
        {
            result = {"msg":"Invalid Human Resource Contact Number", "status":false, "description":"Number only", "data":null}
			return (result);
           
        }

    var mobileLength1 = Object.keys(body.hr_contact_no).length; // Taking length
    if(mobileLength1 < 10 )
        {
            result = {"msg":"Invalid Human Resource Contact Number Length minimum 10", "status":false, "description":"invalid number", "data":null}
			return (result);
            
        }

    if(body.website==undefined || body.website==null || body.website=='') 
    {
        result={"status":true}
        return result;
    }else
    {
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
}

module.exports.CheckValidation = CheckValidation;