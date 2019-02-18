const express = require("express");

let result;
function status(msg, status, description, data)
{
    result = {"msg":msg, "status":status, "description":description, "data":data}
    return (result);
}

function CheckMail(email)
{

if(email)
	{
		function validateEmail(email)
		{
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	
		return re.test(email);
		}
		if (!validateEmail(email))
		{
		  return false
		}else
		{
		  return true;
		}
	}
}

function CheckMobile(num)
{
  if(num)
  {
    function validateIsNum(num)
    {
        var pattern = /^\d+$/;
        return pattern.test(num);
    }

    if (!validateIsNum(num))
    {
      return false;
    }else
    {
      return true;
    }
  }
}

module.exports.status = status;
module.exports.CheckMail = CheckMail;
module.exports.CheckMobile = CheckMobile;