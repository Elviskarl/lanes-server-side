const express = require('express');
const {saveImage,deleteImage, getAllImages} = require('../controllers/images')

const router = express.Router();

router.get('/images',getAllImages);
router.post('/images',saveImage);
router.delete('/images',deleteImage);

module.exports = router;