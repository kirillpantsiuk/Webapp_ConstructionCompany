const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const { protect } = require('../middleware/authMiddleware'); // ПЕРЕВІР ШЛЯХ

// @desc    Отримати всі матеріали
router.get('/', protect, async (req, res) => {
  try {
    const materials = await Material.find({});
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// @desc    Додати новий матеріал
router.post('/', protect, async (req, res) => {
  try {
    const material = new Material(req.body);
    const createdMaterial = await material.save();
    res.status(201).json(createdMaterial);
  } catch (error) {
    res.status(400).json({ message: 'Помилка створення' });
  }
});

module.exports = router;