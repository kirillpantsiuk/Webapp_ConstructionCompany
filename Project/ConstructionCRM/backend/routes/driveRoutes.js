const express = require('express');
const router = express.Router();
const { getFilesFromFolder } = require('../controllers/driveController');
const { protect } = require('../middleware/authMiddleware'); // Переконайтеся, що шлях вірний

// Ми використовуємо protect, щоб тільки авторизовані користувачі могли бачити креслення
router.get('/folder/:folderId', protect, getFilesFromFolder);

module.exports = router;