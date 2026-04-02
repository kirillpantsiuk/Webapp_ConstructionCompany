const express = require('express');
const router = express.Router();
const { createClient } = require('../controllers/clientController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ПЕРЕВІРТЕ: тут має бути '/', а НЕ '/api/clients'
router.post('/', protect, authorize('Manager'), createClient);

module.exports = router;