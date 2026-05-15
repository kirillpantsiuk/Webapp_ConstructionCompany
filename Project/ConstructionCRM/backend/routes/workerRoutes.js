const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const { protect } = require('../middleware/authMiddleware');

// @desc    Отримати всіх робітників (з фільтрацією за професією та статусом)
// @route   GET /api/workers
router.get('/', protect, async (req, res) => {
  try {
    const { specialization, isAvailable } = req.query;
    let query = {};

    if (specialization) {
      query.specialization = specialization;
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    const workers = await Worker.find(query).sort({ lastName: 1 });
    res.json(workers);
  } catch (error) {
    console.error('Get workers error:', error);
    res.status(500).json({ message: 'Помилка отримання списку робітників' });
  }
});

// @desc    МАСОВЕ вивільнення робітників (для завершення об'єкта)
// @route   POST /api/workers/bulk-release
router.post('/bulk-release', protect, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Не надано масив ID робітників' });
    }

    // Оновлюємо статус усіх вказаних робітників на "Вільний"
    const updateResult = await Worker.updateMany(
      { _id: { $in: ids } },
      { $set: { isAvailable: true } }
    );

    res.json({ 
      message: `Успішно вивільнено ${updateResult.modifiedCount} робітників`,
      count: updateResult.modifiedCount 
    });
  } catch (error) {
    console.error('Bulk release error:', error);
    res.status(500).json({ message: 'Помилка при масовому оновленні статусів' });
  }
});

// @desc    Змінити статус робітника (одиничний запис)
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