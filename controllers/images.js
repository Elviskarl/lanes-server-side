const imageModel = require('../model/Images');
function getAllImages(req,res){
  res.status(200).json({message: "Here are the images"});
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
    
    const detailsUpload = await imageModel.create({
      latitude,longitude,severity,
      dateTaken: newDate
    });
    console.log(detailsUpload);
    // if(!detailsUpload){
    //   }
    res.status(200).json({message: "Successfully uploaded the image",
    data: detailsUpload
  });
}catch(err){
  console.log(err);
  return res.status(500).json({err});
}
}

function deleteImage(req,res){
  res.status(200).json({message: "Successfully removed the image"});
}
module.exports = {getAllImages,saveImage,deleteImage}