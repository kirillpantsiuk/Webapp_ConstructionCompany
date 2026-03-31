const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/userController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
// Тільки SuperAdmin з валідним токеном зможе викликати register
router.post('/register', protectAdmin, registerUser);

module.exports = router;