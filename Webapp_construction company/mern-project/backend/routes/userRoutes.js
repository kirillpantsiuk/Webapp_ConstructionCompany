// routes/userRoutes.js
const express = require('express');
const { createUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('Foreman', 'ProjectManager', 'Director'), createUser);
router.get('/', protect, authorize('Foreman', 'ProjectManager', 'Director'), getUsers);
router.put('/:id', protect, authorize('Foreman', 'ProjectManager', 'Director'), updateUser);
router.delete('/:id', protect, authorize('Foreman', 'ProjectManager', 'Director'), deleteUser);

module.exports = router;
