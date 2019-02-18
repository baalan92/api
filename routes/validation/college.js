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

    if(body.college_code==undefined || body.college_code==null || body.college_code=='') 
		{
            result = {"msg":"College code cannot be empty", "status":false, "description":"college_code is empty", "data":null}
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

    if(body.palcement_head_name==undefined || body.palcement_head_name==null || body.palcement_head_name=='') 
		{
            result = {"msg":"Palcement head name cannot be empty", "status":false, "description":"palcement_head_name is empty", "data":null}
			return (result);
			
        }

    if(body.placement_head_email==undefined || body.placement_head_email==null || body.placement_head_email=='') 
		{
            result = {"msg":"placement head email cannot be empty", "status":false, "description":"placement_head_email is empty", "data":null}
			return (result);
			
        }

    if(!setting.CheckMail(body.placement_head_email))
        {
            result = {"msg":"Invalid Email Address", "status":false, "description":"wrong email", "data":null}
			return (result);
           
        }

    if(body.placement_head_contact_no==undefined || body.placement_head_contact_no==null || body.placement_head_contact_no=='') 
		{
            result = {"msg":"Placement head contact no cannot be empty", "status":false, "description":"placement_head_contact_no is empty", "data":null}
			return (result);
			
        }

    if(!setting.CheckMobile(body.placement_head_contact_no))
        {
            result = {"msg":"Invalid Placement Head Contact Number", "status":false, "description":"Number only", "data":null}
			return (result);
           
        }

    var mobileLength1 = Object.keys(body.placement_head_contact_no).length; // Taking length
    if(mobileLength1 < 10 )
        {
            result = {"msg":"Invalid Number Length minimum 10", "status":false, "description":"invalid number", "data":null}
			return (result);
            
        }

    if(body.website==undefined || body.website==null || body.website=='') 
		{
            result = {"msg":"Website cannot be empty", "status":false, "description":"website is empty", "data":null}
			return (result);
			
        }

    if(body.address==undefined || body.address==null || body.address=='') 
		{
            result = {"msg":"Address cannot be empty", "status":false, "description":"address is empty", "data":null}
			return (result);
			
        }

    if(body.total_student==undefined || body.total_student==null || body.total_student=='') 
		{
            result = {"msg":"Total students cannot be empty", "status":false, "description":"total_student is empty", "data":null}
			return (result);
			
        }

    if(body.geolocation==undefined || body.geolocation==null || body.geolocation=='') 
		{
            result = {"msg":"Geolocation cannot be empty", "status":false, "description":"geolocation is empty", "data":null}
			return (result);
			
        }

    if(body.university_id==undefined || body.university_id==null || body.university_id=='') 
		{
            result = {"msg":"Please select a university", "status":false, "description":"university_id is empty", "data":null}
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