const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const { protect } = require('../middleware/authMiddleware');

// @desc    Отримати всіх робітників (з можливістю фільтрації)
// @route   GET /api/workers
router.get('/', protect, async (req, res) => {
  try {
    const { specialization, isAvailable } = req.query;
    let query = {};

    // Якщо фронтенд хоче відфільтрувати за професією
    if (specialization) {
      query.specialization = specialization;
    }

    // Якщо фронтенд хоче бачити тільки вільних робітників
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    // Сортуємо за прізвищем для зручності в списку
    const workers = await Worker.find(query).sort({ lastName: 1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Помилка отримання списку робітників' });
  }
});

// @desc    Змінити статус доступності робітника
// @route   PATCH /api/workers/:id/status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (worker) {
      worker.isAvailable = req.body.isAvailable;
      const updatedWorker = await worker.save();
      res.json(updatedWorker);
    } else {
      res.status(404).json({ message: 'Робітника не знайдено' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Помилка при оновленні статусу' });
  }
});

module.exports = router;