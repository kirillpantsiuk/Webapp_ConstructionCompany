const express = require('express');
const router = express.Router();
const SuperAdmin = require('../models/SuperAdmin');

// Авторизація супер адміна
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(400).json({ message: '❌ Invalid credentials' });
    }

    const isMatch = await superAdmin.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: '❌ Invalid credentials' });
    }

    // Якщо все добре
    res.json({ message: '✅ Super Admin login successful', role: superAdmin.role });
  } catch (error) {
    res.status(500).json({ message: '❌ Error logging in', error });
  }
});

module.exports = router;
