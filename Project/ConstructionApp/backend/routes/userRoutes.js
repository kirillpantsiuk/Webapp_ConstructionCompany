const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protectSuperAdmin } = require('../middleware/authMiddleware');

// CREATE
router.post('/create', protectSuperAdmin, async (req, res) => {
  const { email, login, password, role, status } = req.body;
  try {
    const user = new User({ email, login, password, role, status });
    await user.save();
    res.status(201).json({ message: '✅ User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: '❌ Error creating user', error });
  }
});

// READ (отримати всіх користувачів)
router.get('/', protectSuperAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// UPDATE
router.put('/:id', protectSuperAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: '✅ User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: '❌ Error updating user', error });
  }
});

// DELETE
router.delete('/:id', protectSuperAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: '❌ Error deleting user', error });
  }
});

module.exports = router;
