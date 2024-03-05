const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Username is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email'
    ]
  }
},{ timestamps: true });

userSchema.pre('save', async function(){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt);
  // next(); This is optional
});

userSchema.methods.getName = function(){
  return this.userName;
}

userSchema.methods.createJWT = function(){
  return jwt.sign({userId: this._id, userName: this.userName},process.env.JWT_SECRET,{expiresIn: '1d'});
}

userSchema.methods.comparePasswords = async function(password){
  const isMatch = await bcrypt.compare(password,this.password);
  return isMatch;
}

module.exports = mongoose.model('users',userSchema);