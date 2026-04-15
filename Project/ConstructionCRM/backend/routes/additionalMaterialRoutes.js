const express = require('express');
const router = express.Router();
const AdditionalMaterial = require('../models/AdditionalMaterial');
const { protect } = require('../middleware/authMiddleware');

// @desc    Отримати всі додаткові матеріали
// @route   GET /api/additional-materials
router.get('/', protect, async (req, res) => {
  try {
    const materials = await AdditionalMaterial.find({});
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Помилка отримання додаткових матеріалів' });
  }
});

// @desc    Додати новий витратний матеріал
// @route   POST /api/additional-materials
router.post('/', protect, async (req, res) => {
  try {
    const { name, unit, price, stage } = req.body;
    const material = new AdditionalMaterial({ name, unit, price, stage });
    const savedMaterial = await material.save();
    res.status(201).json(savedMaterial);
  } catch (error) {
    res.status(400).json({ message: 'Помилка валідації даних' });
  }
});

// @desc    Видалити матеріал
// @route   DELETE /api/additional-materials/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const material = await AdditionalMaterial.findById(req.params.id);
    if (material) {
      await material.deleteOne();
      res.json({ message: 'Матеріал видалено' });
    } else {
      res.status(404).json({ message: 'Матеріал не знайдено' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router;