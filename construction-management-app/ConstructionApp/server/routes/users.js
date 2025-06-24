const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// 👉 GET /api/users?role=builder
router.get('/', auth, async (req, res) => {
  const { role } = req.query;
  if (!role) return res.status(400).json({ msg: 'Параметр role є обов’язковим' });

  try {
    const users = await User.find({ role }).select('_id username role');
    res.json(users);
  } catch (err) {
    console.error('Помилка при запиті користувачів за роллю:', err.message);
    res.status(500).json({ msg: 'Помилка сервера' });
  }
});

module.exports = router;
