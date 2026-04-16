const express = require('express');
const router = express.Router();
const CalendarPlan = require('../models/CalendarPlan');
const { protect } = require('../middleware/authMiddleware');

// @desc    Отримати всі календарні плани
// @route   GET /api/calendar-plans
router.get('/', protect, async (req, res) => {
  try {
    const plans = await CalendarPlan.find()
      .populate('objectId', 'address')
      .populate('stages.tasks.assignedWorkers', 'firstName lastName specialization contacts');
      
    res.json(plans || []);
  } catch (error) {
    console.error('GET Calendar Plans Error:', error.message);
    res.status(500).json({ message: 'Помилка отримання календарних планів' });
  }
});

// @desc    Створити або оновити календарний план
// @route   POST /api/calendar-plans
router.post('/', protect, async (req, res) => {
  try {
    const { objectId, stages } = req.body;

    if (!objectId) {
      return res.status(400).json({ message: 'Не вказано об\'єкт будівництва' });
    }

    // ВИПРАВЛЕНО: замість { new: true } тепер використовуємо { returnDocument: 'after' }
    const plan = await CalendarPlan.findOneAndUpdate(
      { objectId },
      { stages },
      { returnDocument: 'after', upsert: true }
    );

    res.status(201).json(plan);
  } catch (error) {
    console.error('POST Calendar Plan Error:', error.message);
    res.status(400).json({ message: 'Помилка збереження календарного плану' });
  }
});

// @desc    Видалити календарний план
// @route   DELETE /api/calendar-plans/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await CalendarPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'План-графік видалено успішно' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка видалення плану' });
  }
});

module.exports = router;