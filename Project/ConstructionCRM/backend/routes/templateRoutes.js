const express = require('express');
const router = express.Router();
const { getTemplates } = require('../controllers/templateController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTemplates);

module.exports = router;