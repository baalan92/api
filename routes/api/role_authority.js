const express = require('express');
const router = express.Router();
const passport = require('passport');
//Load Input Validation
const Role_authority = require('../../models/role_authority');
const setting=require("../return_msg/setting");
let middleware = require('../../validation/middleware');

//@route GET api/university/register
//@desc Register route
//@access Public

router.post('/',middleware.checkToken, (req, res) => {

    var result=middleware.function1("CAN_ASSIGN_ROLE_AUTHORITIES");
    if(!result.status)
    {
        return res.send(result);
    }

    Role_authority.insertMany(req.body.list, function(err, result){
        if(err) res.send(
  
          setting.status("Not create",false,"authority not created",err)
  
        );
        else res.send(
  
          setting.status("created",true,"authority created",result)
  
        );
    });
})

//@route  GET api/university/id
//@desc  Get one  university
//@access Public
router.get('/:id',middleware.checkToken, (req, res) => {

    var result=middleware.function1("CAN_ASSIGN_ROLE_AUTHORITIES");
    if(!result.status)
    {
        return res.send(result);
    }

    Role_authority.find({role_id:req.params.id})
        .then(result => {
            res.send(
  
                setting.status("Show all",true,"details",result)
        
              );
        });   
})

//@route GET api/roleauthority/id
//@desc Register route
//@access Public
router.post('/:id',middleware.checkToken, (req, res) => {

    var result=middleware.function1("CAN_ASSIGN_ROLE_AUTHORITIES");
    if(!result.status)
    {
        return res.send(result);
    }
    
    var ObjectId = require('mongodb').ObjectID;

	if(!ObjectId.isValid(req.params.id))
        {
            return res.send(
                        
                setting.status("ID wrong","False","object id wrong",null)

            );
        }

    const id = req.params.id;

    Role_authority.remove({role_id:id})
        .exec()
        .then(() => {
                Role_authority.insertMany(req.body.list, function(err, result){
                    if(err) res.send(
            
                    setting.status("Error",false,"authority not updated",err)
            
                    );
                    else res.send(
            
                    setting.status("Updated",true,"authority updated",result)
            
                    );
                });
            })
        .catch(err => {
            console.log(err);
            res.json(
    
            setting.status("Error","False","Error",err)
    
            );
        }); 
})

module.exports = router;