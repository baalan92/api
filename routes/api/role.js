const express = require('express');
const router = express.Router();
const passport = require('passport');
//Load Input Validation
const Role = require('../../models/role');
const setting=require("../return_msg/setting");
const roleValidation=require("../validation/role");
let middleware = require('../../validation/middleware');

//@route GET api/university/register
//@desc Register route
//@access Public
router.post('/',middleware.checkToken, (req, res) => {

    // var result=middleware.function1("CAN_ADD_ROLE");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }


    console.log(req.body);
    
    if(req.body.name==undefined || req.body.name==null || req.body.name=='') 
      {
         return res.json(

            setting.status("Name cannot be empty",false,"name is empty",null)
    
        );
      }

    const newRole = new Role({
        name: req.body.name,
        description: req.body.description,
        
    });

    newRole.save()
        .then(role =>{
            res.json(

                setting.status("role created",true,"created",role)
        
            );
        })
        .catch(err => {
            if(err.errors.name)
                {
                    res.json(

                        setting.status("name already exits",false,"name unique",null)
                
                    );
                }
            
        });    
})


//@route  GET api/university/all
//@desc  Get all  university
//@access Public

router.get('/',middleware.checkToken, (req, res,next) => {

    // var result=middleware.function1("CAN_VIEW_ROLE");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }


    Role.find()
        .then(result => {
            res.send(
  
                setting.status("Show all",true,"details",result)
        
              );
        }); 
})

//@route  GET api/university/id
//@desc  Get one  university
//@access Public
router.get('/:id', (req, res) => {

    // var result=middleware.function1("CAN_VIEW_ROLE");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }

    var ObjectId = require('mongodb').ObjectID;
    const id=req.params.id;

    if(!ObjectId.isValid(id))
        {
            return res.send(
                    
                setting.status(validation.FALSE,"False","incorrect id",null)

                );
        }

    Role.find({_id:id,deleted:false})
        .then(result => {

            console.log(result[0].name);
            
            res.send(
  
                setting.status("Show all",true,"details",result)
        
              );
        });   
})

// @route   DELETE api/university/:id
// @desc    Delete university
// @access  Private
router.delete(
    '/:id',middleware.checkToken,
   // passport.authenticate('jwt', { session: false }),
    (req, res) => {

    // var result=middleware.function1("CAN_DELETE_ROLE");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }
    
    var ObjectId = require('mongodb').ObjectID;
    var id=req.params.id;
    
    if(!ObjectId.isValid(id))
        {
            return res.send(
                    
                setting.status("Incorrect ID","False","incorrect id",null)

                );
        }
        
        Role.remove({_id:id})
        .exec()
        .then(() => {
                res.json(
    
                    setting.status("Role deleted","True","Deleted",null)
    
                );
            })
        .catch(err => {
            console.log(err);
            res.json(
    
            setting.status("Error","False","Error",err)
    
            );
        });    
    });

//@route GET api/university/universityupdate
//@desc Register route
//@access Public
router.post('/:id',middleware.checkToken, (req, res) => {

    // var result=middleware.function1("CAN_EDIT_ROLE");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }


    if(req.body.name==undefined || req.body.name==null || req.body.name=='') 
      {
         return res.json(

            setting.status("Name cannot be empty",false,"name is empty",null)
    
        );
      }

    var ObjectId = require('mongodb').ObjectID;

	if(!ObjectId.isValid(req.params.id))
        {
            return res.send(
                        
                setting.status("ID wrong","False","object id wrong",null)

            );
        }

    const id = req.params.id;

    Role.findOne({
            _id: id
        })
        .then(university => {
            if (university) {
                
                Role.findOneAndUpdate(
                    { _id : id },
                    {$set:{name: req.body.name}},
                    {runValidators: true, context: 'query' })
                   // {_id:id}}
                  .then(university =>{
                    res.json(
		
                        setting.status("Role Updated",true,"updated",university)
                
                      );
                  })
                  .catch(err =>{
                   return  res.json(
		
                    setting.status("Error",false,"error",err)
            
                  );
                  });
            } else {
                res.json(
		
                    setting.status("University Not Found",false,"error",err)
            
                  );
            }
        })
})

module.exports = router;