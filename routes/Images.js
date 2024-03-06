const express = require('express');
const {saveImage, getAllImages,getUserImage} = require('../controllers/images')

const router = express.Router();

router.get('/images',getAllImages);
router.get('/images/user',getUserImage);
router.post('/images',saveImage);

module.exports = router;