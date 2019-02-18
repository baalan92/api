const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
let middleware = require('../../validation/middleware');


const passport = require('passport');
//Load Input Validation
const Setting = require('../../models/setting');
const Notification = require('../../models/notification');



exports.pagecontent=10;
exports.question_limit=4;

router.post('/:id',middleware.checkToken,(req, res) => {

    var result=middleware.function1("CAN_EDIT_UNIVERSITIES");
    if(!result.status)
    {
        return res.send(result);
    }

    var result=uniValidation.CheckValidation(req.body);
    if(!result.status)
    {
        return res.send(result);
    }

    var ObjectId = require('mongodb').ObjectID;

	if(!ObjectId.isValid(req.params.id))
        {
            return res.send(
                        
                setting.status("ID wrong",false,"object id wrong",null)

            );
        }

    const id = req.params.id;

    Setting.findOne({
            _id: id
        })
        .then(university => {
            if (university) {
                
                University.findOneAndUpdate(
                    { _id : id },
                    {$set:{key: req.body.key,value: req.body.email}},
                    {runValidators: true, context: 'query' })
                   // {_id:id}}
                  .then(university =>{
                    res.json(
		
                        setting.status("Setting Updated",true,"updated",university)
                
                      );
                  })
                  .catch(err =>{
                    if(err)
                        {
                            res.json(
		
                                setting.status("Error",false,"error",err)
                        
                              );
                        }
                  });
            } else {
                res.json(
		
                    setting.status("Setting Not Found",false,"id wrong",err)
            
                  );
            }
        })
})




let result;
  function status(msg,status,description,data)
  {
		//result = '\r\n"msg": "' + msg + '"\n"status": "' + status + '"\n"description": "' + description + '"\n '
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

function save_notification(student_id,employer_id,vacancy_id,msg,status)
{
    const newUniversity = new Notification({
        student_id:student_id,
        employer_id: employer_id,
        vacancy_id:vacancy_id,
        msg:msg,
        status:status
    });

    newUniversity.save()
        .then(university =>{
            console.log("saved")
        })
        .catch(err => {
            if(err)
            {
               console.log("error",err)
            }
            
        });
}

module.exports.status = status;
module.exports.CheckMail = CheckMail;
module.exports.CheckMobile = CheckMobile;
module.exports.save_notification = save_notification;