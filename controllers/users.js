const jwt = require('jsonwebtoken');
const Unauthenticated = require('../errors/Unauthenticated');
const { StatusCodes } = require('http-status-codes');

async function login(req,res){
  try {
    const {username,password} = req.body;
    if(!username || !password ){
     throw new Unauthenticated('Please provide a username and password');
    }
    const id = new Date().getTime();
    const token = jwt.sign({id, username},process.env.JWT_SECRET,{expiresIn: '1d'});
    res.status(StatusCodes.OK).json({message: "Welcome to the login route. You have created a token",token});  
  } catch (error) {
      res.status(error.statusCode).json({message: error.message});
  }
}

module.exports = {login};