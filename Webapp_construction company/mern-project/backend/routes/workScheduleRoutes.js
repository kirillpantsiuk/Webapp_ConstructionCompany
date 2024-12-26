// routes/workScheduleRoutes.js
const express = require('express');
const { getWorkSchedules } = require('../controllers/workScheduleController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('Builder', 'Foreman', 'ProjectManager', 'Director'), getWorkSchedules);

module.exports = router;
