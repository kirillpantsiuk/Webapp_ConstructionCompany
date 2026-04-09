const express = require('express');
const router = express.Router();
const Blueprint = require('../models/Blueprint'); // Переконайтеся, що модель створена (див. Крок 2)

// @desc    Отримати всі креслення
// @route   GET /api/blueprints
// @access  Public (або Private, якщо додасте auth middleware)
router.get('/', async (req, res) => {
  try {
    const blueprints = await Blueprint.find({});
    res.json(blueprints);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні креслень' });
  }
});

module.exports = router;