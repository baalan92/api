const express = require('express');
const router = express.Router();
const passport = require('passport');
//Load Input Validation
const Authority = require('../../models/authority');
const setting=require("../return_msg/setting");
let middleware = require('../../validation/middleware');

//@route GET api/university/register
//@desc Register route
//@access Public
router.post('/',middleware.checkToken, (req, res) => {

    var result=middleware.function1("CAN_ADD_AUTHORITY");
    if(!result.status)
    {
        return res.send(result);
    }

    Authority.insertMany(req.body.list, function(err, result){
        if(err) res.send(
  
          setting.status("validation.NOT_FOUND",false,"authority not created",err)
  
        );
        else res.send(
  
          setting.status("validation.AGENDA_CREATE",true,"authority created",result)
  
        );
    });
})

//@route  GET api/university/all
//@desc  Get all  university
//@access Public

router.get('/',middleware.checkToken, (req, res,next) => {

    // var result=middleware.function1("CAN_VIEW_AUTHORITY");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }


    Authority.find()
        .then(result => {
            res.send(
  
                setting.status("Show all",true,"details",result)
        
              );
        });     
})

module.exports = router;