const express = require('express');
const {login} = require('../controllers/users');

const router = express.Router();

// POST /login
router.post('/', login);

module.exports = router;