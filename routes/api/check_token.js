const express = require('express');
const router = express.Router();
const passport = require('passport');
//Load Input Validation
const University = require('../../models/university');
const setting=require("../return_msg/setting");
const uniValidation=require("../validation/university");
let middleware = require('../../validation/middleware');


//@route GET api/university/register
//@desc Register route
//@access Public
router.post('/', middleware.checkToken, (req, res) => {

  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

  if (token)
  {
    if (token.startsWith('Bearer '))
    {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    jwt.verify(token, config.secretOrKey, async (err, decoded) => {
      if (err)
      {
        return res.json({"msg":"Token is not valid", "status": false, "description":"Token is not valid", "data":null});
      }
    });
  }

  else if(token==null || token==undefined)
  {
    return res.json({"msg":"Auth token empty", "status": false, "description":"empty token", "data":null});
  }
  else
  {
    return res.json({"msg":"Auth token is not supplied", "status": false, "description":"Auth token is not supplied", "data":null});

  }
});
module.exports = router;