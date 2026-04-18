const express = require('express');
const router = express.Router();
const { saveCalendarPlan } = require('../controllers/technicalTaskController');

// Роут для збереження плану (через PUT запит до конкретного об'єкта)
router.put('/:objectId/plan', saveCalendarPlan);

module.exports = router;