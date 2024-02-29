const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  user: {
    type: String,
    default: 'user'
  },
  latitude: {
    type: Number,
    required: [true, 'Why no Latitude']
  },
  longitude: {
    type: Number,
    required: [true, 'Why no Longitude']
  },
  severity:{
    type: String,
    enum:{
      values: ['high','medium','low'],
      message: '{VALUE} is not supported'
    },
    trim: true
  },
  cloudinary_url:{
    type: String,
    required: [true, 'Why no base64String']
  },
  cloudinary_public_id: {
    type: String,
    required: [true, 'Why no cloudinary_public_id']
  },
  dateTaken: {
    type: String,
    required: [true, 'Why no date']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
},{ timestamps: true });

module.exports = mongoose.model('metadata',imageSchema);