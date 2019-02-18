const express = require('express');
const router = express.Router();
const passport = require('passport');
//Load Input Validation
const Question = require('../../models/written_questions');
const setting=require("../return_msg/setting");
const questionValidation=require("../validation/question");
let middleware = require('../../validation/middleware');
const delay = require('delay');
const Student = require('../../models/student_enrollment');
var unique = require('array-unique');


//@route GET api/university/register
//@desc Register route
//@access Public
router.post('/',middleware.checkToken, (req, res) => {

    console.log(req.body);
    
    var result=questionValidation.CheckValidation(req.body);
    if(!result.status)
    {
        return res.send(result);
    }

    const question = new Question({
       question: req.body.question,
        topic: req.body.topic,
        ans:req.body.ans,
        correct_ans:req.body.correct_ans
    });

    question.save()
        .then(role =>{
            res.json(

                setting.status("Question created",true,"created",role)
        
            );
        })
        .catch(err => {
            if(err.errors.question)
                {
                    res.json(

                        setting.status("question already exits",false,"question unique",null)
                
                    );
                }
            
        });    
})


//@route  GET api/university/all
//@desc  Get all  university
//@access Public

router.get('/', middleware.checkToken,(req, res) => {

    // var result=middleware.function1("CAN_VIEW_COURSES");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }   


    var aggregate = Question.aggregate();

    var page_no = req.param('page');
    var search = req.param('search');

    aggregate.sort({"createdAt" : -1})
 
    if(search===null || search ===undefined)
    {
        
    }else
    {
        aggregate.match({"question":{"$regex": search, "$options": "i"}});
    }

    
    if(page_no==0)
    {
        res.send(
        
            setting.status(validation.SHOW,false,"page No error",null)

        );
    }

    var options = { page : page_no, limit : setting.pagecontent}

    Question.aggregatePaginate(aggregate, options, function(err, results, pageCount, count) {
        if(err) 
        {
            
            res.send(
    
                setting.status("Error",false,"error",err)

            );
        }
        else
        { 
        
            res.send(
        
                setting.status("Details'",true,"No data found",{pages:pageCount,count:count,pagesize:setting.pagecontent,results})

            );
        
        }
    })       
})


router.get('/students/exam',middleware.checkToken, async (req, res,next) => {

    let cat=[];
    let question=[];
    let limit=setting.question_limit;

    Question.find()
        .then(async result => {

            console.log(result);
            for(let x=0 ;x<result.length;x++)
            {
                cat.push(result[x].topic)
            }

            console.log(unique(cat))

    let topic=unique(cat);

   for(let x=0;x<topic.length;x++)
   {
         await Question.findRandom({"topic":topic[x]}, {}, {limit: limit},async function (err,element){
            // if(err)
            // {
            //    console.log("error")
            // }
            // else
            // {
                // if(element.length==limit)
                // {
                    question.push(await element)
               // }            

                if(question.length==3)
                {  
                    let new_question=[];
                    for(let y=0;y<question.length;y++)
                    {
                        for(let z=0;z<3;z++)
                        {
                            new_question.push(question[y][z])
                        } 

                    }
                    //setting.status("Questionss",true,"details found",await questionn(new_question))
                   res.send({msg:"Questionss",status:true,description:"details found",count:new_question.length,data:await questionn(new_question)}) 
                }
            //}
        })
    }
})
 }); 

let x=0;

async function questionn(question)
{
    return question;
    
}

async function random_question()
{
    
}




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

    Question.find({_id:id})
        .then(result => {
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
        
        Question.findByIdAndUpdate(id, {
            status: "deactive",
            }, {new: true})

            .then(user => {
                res.json(setting.status("Deleted", true, "deleted", null));
            })
            .catch(err => {
                res.json(setting.status("Error", false, "error", err));
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


    if(req.body.question==undefined || req.body.question==null || req.body.question=='') 
      {
         return res.json(

            setting.status("Question cannot be empty",false,"question is empty",null)
    
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

    Question.findOne({
            _id: id
        })
        .then(university => {
            if (university) {
                
                Question.findOneAndUpdate(
                    { _id : id },
                    {$set:{question: req.body.question,
                        topic: req.body.topic,
                        ans:req.body.ans,
                        correct_ans:req.body.correct_ans}},
                    {runValidators: true, context: 'query' })
                   // {_id:id}}
                  .then(university =>{
                    res.json(
		
                        setting.status("Question Updated",true,"updated",university)
                
                      );
                  })
                  .catch(err =>{
                   return  res.json(
		
                    setting.status("Error",false,"error",err)
            
                  );
                  });
            } else {
                res.json(
		
                    setting.status("Question Not Found",false,"error",err)
            
                  );
            }
        })
})


router.post('/exam/marks', async (req, res) => {

    // var result=middleware.function1("CAN_VIEW_ROLE");
    // if(!result.status)
    // {
    //     return res.send(result);
    // }
let stu_id=req.body.stu_id;
//let stu_id="5c45625cb6d3472e78c44086";
let ans=req.body.list;
let correct_ans;
let total=ans.length;

for (let x = 0; x < ans.length; x++) {
    
    Question.find({_id:ans[x].id})
        .then(async result => {

            correct_ans=await result[0].correct_ans;

            if(correct_ans===ans[x].ans)
            {
                total=total;
            }
            else
            {
                total=total-1;
            }

            if(x==ans.length-1)
            {
                console.log(total);
                console.log(ans.length)

                let written_test_result=parseInt((total/ans.length)*100) ;

                console.log("written_test_result",written_test_result);

                
                Student.findByIdAndUpdate(stu_id, {
                written_test_result: written_test_result,
                
            }, {new: true})
              .then(user => {
                  res.json(setting.status("User Updated", true, "updated", written_test_result));
                })
                .catch(err => {
                    res.json(setting.status("User Not Found", false, "error", err));
                });

            }           
        })   
}

//await console.log(total);

    // var ObjectId = require('mongodb').ObjectID;
    // const id=req.params.id;

    // if(!ObjectId.isValid(id))
    //     {
    //         return res.send(
                    
    //             setting.status(validation.FALSE,"False","incorrect id",null)

    //             );
    //     }

    // Question.find({_id:id})
    //     .then(result => {
    //         res.send(
  
    //             setting.status("Show all",true,"details",result)
        
    //           );
    //     });   
})


module.exports = router;