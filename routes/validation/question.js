const express = require('express');
const router = express.Router();
//const passport = require('passport');
//Load Input Validation
const setting=require("../return_msg/setting");
var validurl=require('valid-url');
var split=require('split')

let result;
function CheckValidation(body)
  {
    
    if(body.question==undefined || body.question==null || body.question=='') 
		{
          result = {"msg":"Question cannot be empty", "status":false, "description":"question is empty", "data":null}
          return (result);
    
    }

    if(body.topic==undefined || body.topic==null || body.topic=='') 
		{
          result = {"msg":"Topic cannot be empty", "status":false, "description":"topic is empty", "data":null}
			    return (result);
			
    }

    if(body.ans==undefined || body.ans==null || body.ans=='') 
		{
          result = {"msg":"Answer cannot be empty", "status":false, "description":"ans is empty", "data":null}
			    return (result);
			
    }

    var anss =body.ans.split("&&");
    console.log(anss);

    if(anss.length<2)
    {
       result = {"msg":"Please enter atleast two answer", "status":false, "description":"ans is 1 is empty", "data":null}
        return (result);
    }

    if(body.correct_ans==undefined || body.correct_ans==null || body.correct_ans=='') 
		{
          result = {"msg":"Correct answer cannot be empty", "status":false, "description":"correct_ans is empty", "data":null}
			    return (result);
			
    }

    var correct_ans =body.correct_ans.split("&&");
    console.log(correct_ans);

    if(correct_ans.length<1)
    {
       result = {"msg":"Please enter correct answer", "status":false, "description":"correct_ans is empty", "data":null}
        return (result);
    }

    result={"status":true}
    return result;
}

module.exports.CheckValidation = CheckValidation;