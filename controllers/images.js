const imageModel = require('../model/Images');
const cloudinary = require('../db/cloudinary');
const BadRequest = require('../errors/badRequest');
async function getAllImages(req,res){
  const allImages = await imageModel.find({});
  res.status(200).json({message: "Here are the images",data: allImages});
}

async function saveImage(req,res){
try {
    let {
      base64String,
      imageDetails: {latitude,longitude,severity,dateTaken}
    } = req.body;
    const date = new Date(dateTaken);
    const newDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).replace(/,/g, '');

    
    console.log(severity);
    // const uploadResponse = await cloudinary.uploader.upload(base64String, {});
    const uploadResponse = await cloudinary.uploader.upload(base64String, {
      folder: 'RoadsApp',
      resource_type: 'image',
      tags: [severity],
      overwrite: true
    });
    console.log(uploadResponse);
    const detailsUpload = await imageModel.create({
      severity,
      location: {
        type: 'Point',
        coordinates: [latitude, longitude]
      },
      dateTaken: newDate,
      cloudinary_url: uploadResponse.secure_url,
      cloudinary_public_id: uploadResponse.public_id
    });
    console.log(detailsUpload);
    if(!detailsUpload){
      res.status(400).json({message: 'Check the severity input field.'});
      throw new BadRequest('Check the severity input field.');
      }
    res.status(200).json({message: "Successfully uploaded the image",
    data: detailsUpload
  });
}catch(err){
  console.log(err);
  return res.status(500).json({
    errorName: err.name,
    errMessage:err.message
  });
}
}

module.exports = {getAllImages,saveImage}