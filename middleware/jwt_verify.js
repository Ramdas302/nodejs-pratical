require('dotenv').config()
const jwt = require("jsonwebtoken");
const config = require("../app/config/jwt.config");
const userauthorization = async (req, res, next) => {
  try {
    var token = req.cookies.accessToken
    if (token != null && token != undefined && token != "") {
      var jwt_token = await jwt.verify(token, process.env.API_KEY);
      if(jwt_token.user_id){
       var userId = jwt_token.user_id
     next()
      }else{
        res.status(401).send({ message: "Token Expired" });
      }
    }else{
      res.status(401).send({ message: "Token Expired" });
    }
  } catch (error) {
    res.status(400).send({
      msg: error,
    });
  }
  };
  module.exports=userauthorization