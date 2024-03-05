const express = require('express');
const {login,register} = require('../controllers/users');

const router = express.Router();

// POST /login
router.post('/login', login);
router.post('/register', register);

module.exports = router;