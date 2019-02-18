const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const setting=require("../validation/settings");

const config = require('../config/keys.js');

let middleware = require('../validation/middleware');

//Passport Middleware

// //Passport Config
// require('../config/passport')(passport);


//const passport = require('passport-local');

//Load Input Validation
const validationRegister = require('../validation/registerValidation');
const validationLogin = require('../validation/loginValidation');
const validationUserUpdate = require('../validation/updateUserValidation');

const Employer = require('../models/employer');
const User = require('../models/user');
const Role_authority = require('../models/role_authority');
const Student = require('../models/student_enrollment');
const loginStatus = require('../models/login_status');

// *** POST *** /api/users/login *** Sign-in with email and password ***
router.post("/login", (req, res) => 
{
  console.log(req.body);
  console.log("------------");

    var validationResult = validationLogin.checkLoginValidation(req.body);

    if (!validationResult.status)
    {
        return res.send(validationResult);
    }

    var email = req.body.email;
    var password = req.body.password;

    //Before login, the account should not be deleted (is_delete:false).
    User.findOne({email: email}, function (err, user)
    {
        if (err)
            return res.status(200).send(setting.status("Try again",false,"Error on server",err));

        //May is_delete:true. i.e : If the user's is_delete field true
        if (!user)
            return res.status(200).send(setting.status("Authentication false",false,"No user found",null));
        
        Employer.findOne({email: email}, function (err, user)
        {
            
        });

        // check if the password is valid
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid)
            return res.status(200).send(setting.status("Authentication false",false,"Wrong password",null));

        // While login add the details to LoginStatus table.
        var objLoginStatus = new loginStatus({
            user_id : user._id,
            in_time : Date.now()
            });

            objLoginStatus.save((err) =>{
                if (err)
                {
                    console.log("New Error : " + err);
                    return next(err);
                }});

        let authority=[];
        let role='';

        Role_authority.find({role_id:user.role}).populate('role_id')
        .then(result => {

            role=result[0].role_id.name;
            console.log(role);

            if(result.length>0)
            {
                for(var x=0;x<result.length;x++)
                {
                    authority.push(result[x].authority)
                }
            }else
            {
                return ("authority not found")
            }

        // if user is found and password is valid
        // create a token
        var token = jwt.sign({ id: user._id,name:user.fname,authority:authority,email:user.email,contact_no:user.contact_no,role:user.role,role_name:role }, config.secretOrKey, {expiresIn: 86400});
        // var token = jwt.sign({ id: user._id }, "This is my secret to create the token", {expiresIn: 86400});

            console.log(authority)

            res.send(
                
                setting.status("Login success",true,"Authentication true",{"loginToken":token})        
                //setting.status("Login success",true,"Authentication true",{"loginToken":token, "id":user._id, "name":user.fname,"role":user.role,"mobile":user.contact_no,"image":user.image,"authority":authority})        
              );
        }); 
        // return the information including token as JSON
    });    
});


// *** POST *** /api/users/register *** Create new local account ***
router.post("/register", (req, res) =>
{
    console.log(req.body);
    console.log("------------");

    var validationResult = validationRegister.checkRegisterValidation(req.body);

    if (!validationResult.status)
    {
        return res.send(validationResult);
    }

    User.findOne({email: req.body.email})
    .then(user =>
        {
            if (user)
            {
                res.status(200).send(setting.status("Email Already exits", false, "Email unique", null))
            }
            else
            {
                User.findOne({contact_no: req.body.contact_no})
                .then(user =>
                    {
                        if (user)
                        {
                            res.status(200).send(setting.status("Contact Already exits", false, "Contact unique", null))
                        }
                        else
                        {
                            const avatar = gravatar.url(req.body.email,
                            {
                                s: '200',
                                r: 'pg',
                                d: 'mm'
                            });

                            const newUser = new User(
                            {
                                fname: req.body.fname,
                                lname: req.body.lname,
                                contact_no: req.body.contact_no,
                                email: req.body.email,
                                password: req.body.password,
                                avatar,
                                role: "5c2f0e8d43abb4222c581d41",status:"active"
                            });
                            console.log("4");

                            //Encrypting the password 
                            bcrypt.genSalt(10, (err, salt) =>
                            {
                                bcrypt.hash(newUser.password, salt, (err, hash) =>
                                {
                                    if (err)
                                        throw err;
                                    newUser.password = hash;

                                    newUser.save()
                                        .then(user => res.status(200).send(setting.status("Account Created Successfully", true, "User created", user._id)))
                                        .catch(err => res.status(200).send(setting.status("Sorry! Try again", false, "Unable to create User", err)))
                                })
                            });
                        }
                    })
            }
        })
})
    
// *** POST *** /api/users/userId *** Update user details ***
router.post("/:id",middleware.checkToken, (req, res) => {

  const id = req.params.id;
  if(!id)
  {
    return res.status(200).send(setting.status("1User Id not found",false,"invalid id",null));
  }

  console.log(req.body);
  console.log("------------");

  var validationResult = validationUserUpdate.checkUserUpdateValidation(req.body);

  if (!validationResult.status)
  {
      return res.send(validationResult);
  }

  User.findOne({_id: id})
  .then(user => {
      if(!user)
      {
        setting.status("User not found",false,"user not found", null)
      }
      else if (user)
      {
        const avatar = gravatar.url(req.body.email,
            {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

          User.findByIdAndUpdate(id, {
                fname: req.body.fname,
                lname: req.body.lname,
                contact_no: req.body.contact_no,
                email: req.body.email,
                avatar,
                role: req.body.role


        }, {new: true})
              .then(user => {
                  res.json(setting.status("User Updated", true, "updated", user));
                })
                .catch(err => {
                    res.json(setting.status("User Not Found", false, "error", err));
                });
            }
            else
            {
                res.json(setting.status("User Not Found", false, "error", err));
            }
        })
})


// Todo : Pass token to get users details
// Todo : pagination
// *** GET *** /api/users/all *** Retrieve all users' basic details ***
router.get("/", middleware.checkToken, (req, res) =>
{

  User.find()
    .select('fname lname email avatar contact_no role')
    // .where('is_deleted').equals('false')
    .exec()
    .then(docs => {
        return res.send(setting.status("User details retrieval successfully",false, "User details retrieval successfully", docs))
        //res.status(200).json(setting.status(validation.SHOW,true,"User details retrieval successfully.",docs))
    .catch(err => {
        return res.send(setting.status("Error in retrieving user details",false, "Error may token", err))
    });
    });


    // var aggregate = User.aggregate();

    // var page_no = req.param('page');
    // var search = req.param('search');

    // aggregate.sort({"createdAt" : -1});

    // if(search === null || search === undefined)
    // {
        
    // }
    // else
    // {
    //     aggregate.match({"name":{"$regex": search, "$options": "i"}});
    // }
    
    // if(page_no == 0)
    // {
    //     res.send(setting.status("Page error",false,"page No error",null));
    // }

    // var options = { page : page_no, limit : setting.pagecontent}

    // User.aggregatePaginate(aggregate, options, function(err, results, pageCount, count)
    // {
    //   if(err)
    //   {
    //     console.log(err)
    //     res.send(setting.status("Error",false,"error",err));
    //   }
    //   else
    //   {
    //     res.send(setting.status("Details'",true,"No data found",{pages:pageCount,count:count,results}));
    //   }
    // })       
})






// getToken = function (headers) {
//   if (headers && headers.authorization) {
//     var parted = headers.authorization.split(' ');
//     if (parted.length === 2) {
//       return parted[1];
//     } else {
//       return null;
//     }
//   } else {
//     return null;
//   }
// };


// *** GET *** /api/users/{userId} *** Retrieve one user's basic details ***
router.get("/:id", middleware.checkToken, function (req, res)
{
  const id = req.params.userId;
  if(!id)
  {
    return res.status(200).send(setting.status("User Id not found",false,"invalid id",null));
  }

  User.find({_id:id})
    .select('fname lname email avatar contact_no role')
    .where('is_deleted').equals('false')
    .exec()
    .then(doc => {
      if (!doc)
      {
        return res.status(200).send(setting.status("Not found",false,"id not found or is_deleted may be true",null));
      }
      else
      {
        return res.status(200).send(setting.status("Found",true,"Details found",doc));
      }
    })
    .catch(err => {
      return res.status(200).send(setting.status("Not found",false,"Error",err));
    });
});

//*******/users/:userId******DELETE******Delete an account***********
router.delete("/:id", middleware.checkToken, function(req, res)
{

    var ObjectId = require('mongodb').ObjectID;
    var id = req.params.id;
    
    if(!ObjectId.isValid(id))
        {
            return res.send(setting.status("Invalid Id",false,"incorrect id",null));
        }
        
    User.findById(req.params.id).then(user => {
            // Delete
            user.remove().then(() => { 
                res.json(setting.status("Deleted",true,"deleted",null))});
          })
          .catch(err =>{
            res.json(setting.status("User Not Found",false,"error",err));
          })
        }    
  );


  router.get("/students", middleware.checkToken, function (req, res, next)
{
  var aggregate = Student.aggregate();

  var page_no = req.param('page');
  var searchName = req.param('searchName');
  var searchEmal = req.param('searchEmal');
  var searchContact = req.param('searchContact');
  var approved=req.param('approved');

    aggregate.sort({"createdAt" : -1})
    //.match({deleted:false})
            //.match({$and:[{"is_submited":false},{"status":{"$regex": searchName, "$options": "i"}}]})
            //.match({"is_approved":false})
            .lookup({ from: "colleges", localField: "college_id", foreignField: "_id",as: "college_doc"})
            .lookup({ from: "courses", localField: "course_id", foreignField: "_id",as: "course_doc"})
            .lookup({ from: "specializations", localField: "specialization_id_major", foreignField: "_id",as: "major_doc"})
            .lookup({ from: "specializations", localField: "specialization_id_minor", foreignField: "_id",as: "minor_doc"})
            .project({password:0});


    if(searchName===null || searchName ===undefined)
    {
        
    }else
    {
        aggregate.match({"fname":{"$regex": searchName, "$options": "i"}});
    }

    if(approved===null || approved ===undefined)
    {
        
    }else
    {
        aggregate.match({"is_approved":false});
    }

  if(searchEmal===null || searchEmal ===undefined)
    {
        
    }else
    {
        aggregate.match({"email":{"$regex": searchEmal, "$options": "i"}});
    }

  if(searchContact===null || searchContact ===undefined)
    {
        
    }else
    {
        aggregate.match({"contact_no":{"$regex": searchContact, "$options": "i"}});
    }
    
    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Student.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
        if(err) 
        {
            
            res.send(
    
                setting.status("Error",false,"error",err)

            );
        }
        else
        { 
        
            res.send(
        
                setting.status("Details'",true,"Data found",{pages:pageCount,count:count,pagesize:Page_cont.pagecontent,results})

            );
        
        }
    })    
});















//   const idToDelete = req.params.id;
//   // Validation not given id to delete
//   if(!idToDelete)
//   {
//     return res.status(200).send(setting.status("Cannot find user",false,"id is not given",null));
//   }

//   // Find the id is exist and user not deleted already
//   User.find({_id:idToDelete, is_deleted:false}).exec(function(err, results)
//   {
//     if (err)
//     res.status(200).json(setting.status("The id may not exist",false,"no id and is_delete false problem", err));

//     // var countIsDelete = results.length;
//     // console.log("the count is : " + countIsDelete);

//     // // To the given id, is_delete should be false

//     // if(countIsDelete > 0)
//     if(results)
//     {
//       User.findByIdAndUpdate(idToDelete, {is_deleted : true}, {new: true})
//         .then(outputs => {
//             if(!outputs)
//             {
//               return res.status(200).send(setting.status("Error in deleting user. Try anain",false,"Error in updating is_delete to true",null));
//             }
//             res.send(setting.status("User deleted successfully",true,"No problem user deleted. And is_delete changed to true",null));
//         }).catch(err => {
//             if(err.kind === 'ObjectId')
//             {
//               return res.status(200).send(setting.status("Id problem",false,"Error",err));          
//             }
//         });
//     }
//     if(!results)
//         res.status(200).json(setting.status("Sorry user is not found",false,"The user may already deleted",null));
//   }); 
// })


// *** POST *** /api/users/userId *** Update user details ***
router.post("/student/:id/marks",middleware.checkToken, (req, res) => {

    const id = req.params.id;
    if(!id)
    {
      return res.status(200).send(setting.status("User Id not found",false,"invalid id",null));
    }
    
    Student.findOne({_id: id})
    .then(user => {
        if(!user)
        {
          setting.status("User not found",false,"user not found", null)
        }
        else if (user)
        {
          const avatar = gravatar.url(req.body.email,
              {
                  s: '200',
                  r: 'pg',
                  d: 'mm'
              });
  
            User.findByIdAndUpdate(id, {
                  fname: req.body.fname,
                  lname: req.body.lname,
                  contact_no: req.body.contact_no,
                  email: req.body.email,
                  avatar,
                  role: req.body.role
  
          }, {new: true})
                .then(user => {
                    res.json(setting.status("User Updated", true, "updated", user));
                  })
                  .catch(err => {
                      res.json(setting.status("User Not Found", false, "error", err));
                  });
              }
              else
              {
                  res.json(setting.status("User Not Found", false, "error", err));
              }
          })
  })
  


module.exports = router;



// router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
//     req.session.save((err) => {
//         if (err) {
//             return next(err);
//         }
//         res.redirect('/');
//     });
// });