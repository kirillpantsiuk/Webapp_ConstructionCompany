const express = require('express');
const { register, login, verifyToken } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyToken);

module.exports = router;
