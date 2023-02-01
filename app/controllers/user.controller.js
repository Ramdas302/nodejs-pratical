const db = require("../../dbconnection/dbconn");
const Sequelize = require("sequelize");
const user = require("../models/users")(db.sequelize, Sequelize);
const Op = user.Op;
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const set_jwt = require("../../utils/jwt");
const jwt = require("jsonwebtoken");
const jwtconfig = require('.././config/jwt.config')
const axios = require('axios')
require('dotenv').config()

module.exports.SignUp = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    var email = req.body.email;
    var emailfind = await user.findOne({ where: { email: email } })
    if (emailfind) {
      return res.status(409).send({
        msg: "This email is already in use!",
      });
    } else {
      var hash = await bcrypt.hash(req.body.password, 10);
      var userdata = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hash,

      };
      let signupdata = await user.create(userdata)
      if (signupdata.dataValues.id > 0) {
        res.status(200).send({
          data: "The user has been registerd with us!",
        });
      } else {
        res.status(400).send({
          msg: "something went wrong",
        });
      }
    }
  } catch (error) {
    res.status(400).send({
      msg: error,
    });
  }
};


module.exports.Login = async (req, res) => {
  try {
    var email = req.body.email;
    var userdata = await user.findOne({ where: { email: email } })
    if (!userdata) {
      res.status(401).send({
        msg: "username or password is incorrect!",
      });
    } else {
      var bResult = await bcrypt.compare(req.body.password, userdata.dataValues.password);
      if (bResult == true) {
        var result = await set_jwt.set_jwt_auth(userdata, res);
        if (result) {
          res.status(200).send({
            data: result,
          });
        } else {
          res.status(400).send({
            msg: "bad request",
          });
        }
      } else {
        res.status(401).send({
          msg: "Username or password is incorrect!",
        });
      }
    }
  } catch (error) {
    res.status(400).send({
      msg: error,
    });
  }
};


module.exports.GetUser = async (req, res) => {
  try {
      var userdata = await user.findOne({ where: { id: req.body.user_id } })
      if (userdata) {
        res.status(200).send({
          data: userdata,
        });
      }else{
        res.status(400).send({
          msg:"user not found",
        });
      }
  } catch (error) {
    res.status(400).send({
      msg: error,
    });
  }
};

module.exports.randomjoke = async (req, res) => {
  try {
  var response = await axios.get("https://api.chucknorris.io/jokes/random");
  if(response){
    res.status(200).send({
      data:response.data.value
    })
    }else{
    res.status(400).send({ message: "bad request" })
    }
  } catch (error) {
    res.status(400).send({
      msg: error,
    });
  }
}

module.exports.refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      var jwt_token = await jwt.verify(refreshToken, process.env.API_KEY)
      if (jwt_token.user_id) {
        const token = jwt.sign({ user_id:jwt_token.user_id}, process.env.API_KEY, {
          expiresIn: jwtconfig.jwtAccessExpiration,
        });
        res.cookie("accessToken", token, { httpOnly: true });
        res.status(200).send({ message: "accessToken generate successfully" });
      } else {
        console.log(err);
        res.status(401).send({ message: "Token Expired" });
      }
    } else {
      res.status(401).send({ message: "Token Expired" });
    }
  } catch (error) {
    res.status(400).send({
      msg: error,
    });
  }
};


module.exports.Logout = async (req, res) => {
  try {
    var token = req.cookies.accessToken
    if (token != null && token != undefined && token != "") {
      var logadata = await res.clearCookie('accessToken');
      if (logadata) {
        res.status(200).send({
          msg: "user logout successfully",
        });
      } else {
        res.status(401).send({ message: "Token Expired" });
      }
    }
  } catch (error) {
    res.status(400).send({
      msg: error,
    });
  }
};



