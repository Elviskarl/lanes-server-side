const imageModel = require('../model/Images');
const cloudinary = require('../db/cloudinary');
const BadRequest = require('../errors/badRequest');
const { StatusCodes } = require('http-status-codes');
async function getAllImages(req,res){
  const allImages = await imageModel.find({});
  res.status(StatusCodes.OK).json({message: "Here are the images",data: allImages});
}

async function saveImage(req,res){
try {
    let {
      base64String,
      imageDetails: {latitude,longitude,severity,dateTaken,user}
    } = req.body;
    const date = new Date(dateTaken);
    const newDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).replace(/,/g, '');

    const uploadResponse = await cloudinary.uploader.upload(base64String, {
      folder: 'RoadsApp',
      resource_type: 'image',
      tags: [severity],
      overwrite: true
    });
    const detailsUpload = await imageModel.create({
      severity,
      location: {
        type: 'Point',
        coordinates: [latitude, longitude]
      },
      dateTaken: newDate,
      cloudinary_url: uploadResponse.secure_url,
      cloudinary_public_id: uploadResponse.public_id,
      user: user

    });
    if(!detailsUpload){
      throw new BadRequest('Check the severity input field.');
      }
    res.status(StatusCodes.OK).json({message: "Successfully uploaded the image",
    data: detailsUpload
  });
}catch(err){
  console.log(err);
  return res.status(err.statusCode).json({
    errorName: err.name,
    errMessage:err.message
  });
}
}

async function getUserImage(req,res){
  const {name} = req.body;
  if(!name || name === "" || name === 'user'){
    return res.status(StatusCodes.BAD_REQUEST).json({message: "Please provide a registered user name"});
  }
  const user = await imageModel.find({user: name});
  if(!user){
    return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
  }
  res.status(StatusCodes.OK).json({message: "Here are the images",data: user,contributions: user.length});
}

module.exports = {getAllImages,saveImage,getUserImage}