const express = require('express');
const router = express.Router();
const ProjectSupply = require('../models/ProjectSupply');
const { protect } = require('../middleware/authMiddleware');

// @desc    Отримати всі відомості
router.get('/', protect, async (req, res) => {
  try {
    const supplies = await ProjectSupply.find()
      .populate('objectId', 'address area') // Тягнемо адресу об'єкта
      .populate('projectId', 'name');      // Тягнемо назву техплану
    
    res.json(supplies || []);
  } catch (error) {
    // ВАЖЛИВО: подивись у термінал бекенда, там з'явиться детальна помилка
    console.error('ERROR GET SUPPLIES:', error.message);
    res.status(500).json({ message: 'Помилка сервера при отриманні відомостей' });
  }
});

// @desc    Затвердити відомість
router.post('/', protect, async (req, res) => {
  try {
    const { objectId, items, projectId } = req.body;

    if (!objectId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Дані неповні' });
    }

    const supply = new ProjectSupply({
      objectId,
      projectId, // Зберігаємо зв'язок з техпланом
      items
    });

    const savedSupply = await supply.save();
    res.status(201).json(savedSupply);
  } catch (error) {
    console.error('ERROR POST SUPPLY:', error.message);
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await ProjectSupply.findByIdAndDelete(req.params.id);
    res.json({ message: 'Видалено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка видалення' });
  }
});

module.exports = router;