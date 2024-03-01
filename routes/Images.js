const express = require('express');
const {saveImage, getAllImages} = require('../controllers/images')

const router = express.Router();

router.get('/images',getAllImages);
router.post('/images',saveImage);

module.exports = router;