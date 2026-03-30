const express = require('express');
const router = express.Router();
const SuperAdmin = require('../models/SuperAdmin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Логін супер адміна
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(400).json({ message: '❌ Invalid credentials' });
    }

    // Перевірка пароля
    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res.status(400).json({ message: '❌ Invalid credentials' });
    }

    // Генеруємо токен
    const token = jwt.sign(
      { id: superAdmin._id, role: superAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: '12d' }
    );

    res.json({ message: '✅ Super Admin login successful', token });
  } catch (error) {
    res.status(500).json({ message: '❌ Error logging in', error });
  }
});

module.exports = router;
