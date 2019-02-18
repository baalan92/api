let jwt = require('jsonwebtoken');
const config = require('../config/keys.js');
const Role_authority = require('../models/role_authority');

let token1;
let authority1;
let user_id;

function checkToken(req, res, next) {
  var ObjectId = require('mongodb').ObjectID;

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
      else
      {

        await Role_authority.find({"role_id":ObjectId(decoded.role)})
        .then( async result => {
          authority1=await result;
        })

        req.decoded = decoded;
        token1= decoded.name;
        user_id=decoded.id;

        console.log(user_id)

        //console.log(token);
        next();
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

    // return res.json({
    //   success: false,
    //   message: 'Auth token is not supplied'
    // });
  }
};


function function1(authority)
{
  console.log(authority1);
  if(authority1.find(task => (task.authority === authority)))
  {
    return ({"status":true});
  }

  else
  {
    return ({"msg":"You cannot auth this", "status": false, "description":"auth is fail", "data":null});      
  }
}

function get_id()
{
  return user_id;
}

module.exports = {checkToken: checkToken};
module.exports.function1=function1;
module.exports.get_id=get_id;

