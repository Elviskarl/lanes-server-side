const userModel = require('../model/Users');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const Unauthenticated = require('../errors/Unauthenticated');

const auth = async function(req,res,next){
  try {
    const authHeader = req.headers.authorization;
    // For now - To fit the current usage of the middleware in the app, we will not throw an error if the token is not present.
    if(!authHeader || !authHeader.startsWith('Bearer ')){
      throw new Unauthenticated('Invalid token');
    }
    const [Bearer,token] = authHeader.split(' ');

    // jwt.verify() is used to verify the token. 
    // If the token is valid, the decoded payload (user) is attached to the request object and the next middleware function is called.
    const payload = jwt.verify(token,process.env.JWT_SECRET);
    req.user = {userId: payload.userId, userName: payload.userName};
    next();
  } catch (error) {
    throw new Unauthenticated('Invalid Auth');
  }
}

module.exports = auth;