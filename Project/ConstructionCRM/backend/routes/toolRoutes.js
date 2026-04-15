const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const { protect } = require('../middleware/authMiddleware');

// @desc    Отримати весь список інструментів
// @route   GET /api/tools
router.get('/', protect, async (req, res) => {
  try {
    const tools = await Tool.find({});
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Помилка отримання списку інструментів' });
  }
});

// @desc    Додати новий інструмент у базу
// @route   POST /api/tools
router.post('/', protect, async (req, res) => {
  try {
    const { name, unit, price } = req.body;
    const tool = new Tool({ name, unit: unit || 'шт', price });
    const savedTool = await tool.save();
    res.status(201).json(savedTool);
  } catch (error) {
    res.status(400).json({ message: 'Помилка при створенні інструменту' });
  }
});

// @desc    Видалити інструмент
// @route   DELETE /api/tools/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (tool) {
      await tool.deleteOne();
      res.json({ message: 'Інструмент видалено' });
    } else {
      res.status(404).json({ message: 'Інструмент не знайдено' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router;