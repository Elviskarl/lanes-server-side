const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  user: {
    type: String,
    default: 'user'
  },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
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

imageSchema.index({ location: '2dsphere' }); // Create a 2dsphere index on the location field

module.exports = mongoose.model('metadata',imageSchema);