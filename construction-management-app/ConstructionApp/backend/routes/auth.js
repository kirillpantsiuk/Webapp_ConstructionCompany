const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// /api/auth/register
router.post('/register', register);

// /api/auth/login
router.post('/login', login);

module.exports = router;