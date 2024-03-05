const jwt = require('jsonwebtoken');
const badRequest = require('../errors/badRequest');
const Unauthenticated = require('../errors/Unauthenticated');
const { StatusCodes } = require('http-status-codes');
const userSchema = require('../model/Users');
const bcrypt = require('bcryptjs');

async function login(req,res){
  try {
    const {email,password} = req.body;
    if(!email || !password ){
     throw new badRequest('Please provide email and password');
    }

    const user = await userSchema.findOne({email});
    if(!user){
      throw new Unauthenticated('Invalid Credentials: User not found.');
    }
    const isPasswordCorrect = await user.comparePasswords(password);
    if(!isPasswordCorrect){
      throw new Unauthenticated('Invalid Credentials: Incorrect password.');
    }
    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
      message: "Successfully Logged In",
      userName: user.userName,
      email: user.email,
      token
    });  
  } catch (error) {
    console.log(error.message);
      res.status(error.statusCode).json({message: error.message});
  }
}

async function register(req,res){
  try {
    const {userName,password,email} = req.body;
    console.log(userName,password,email);
    if(!userName || !password || !email){
      throw new badRequest('Please provide a username, password and email');
    }

    const user = await userSchema.create({userName,password,email});
    console.log(user);
    if(!user){
      throw new Unauthenticated('User not created');
    }
    res.status(StatusCodes.OK).json({
      message: "User has been successfully created",
      userName: user.getName(),
      token: user.createJWT()});
  //   const id = new Date().getTime();
  //   const token = jwt.sign({id, username},process.env.JWT_SECRET,{expiresIn: '1d'});
  //   res.status(StatusCodes.OK).json({message: "Welcome to the register route. You have created a token",token});  
  } catch (error) {
    console.log(error.message);
      res.status(StatusCodes.BAD_REQUEST).json({message: error.message});
  }
}

module.exports = {login,register};