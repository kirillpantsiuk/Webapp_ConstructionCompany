// routes/teamRoutes.js
const express = require('express');
const { createTeam, getTeams, updateTeam, deleteTeam } = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('Foreman', 'ProjectManager', 'Director'), createTeam);
router.get('/', protect, authorize('Foreman', 'ProjectManager', 'Director'), getTeams);
router.put('/:id', protect, authorize('Foreman', 'ProjectManager', 'Director'), updateTeam);
router.delete('/:id', protect, authorize('Foreman', 'ProjectManager', 'Director'), deleteTeam);

module.exports = router;
