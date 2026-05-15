const express = require('express');
const router = express.Router();
const ConstructionReport = require('../models/ConstructionReport');
const CalendarPlan = require('../models/CalendarPlan');
const { protect } = require('../middleware/authMiddleware');

// @desc    Отримати всі звіти для архіву
// @route   GET /api/reports
router.get('/', protect, async (req, res) => {
  try {
    // .populate('objectId', 'address') дозволяє замість просто ID побачити адресу об'єкта
    const reports = await ConstructionReport.find()
      .populate('objectId', 'address')
      .sort({ createdAt: -1 }); // Нові звіти будуть зверху
    res.json(reports);
  } catch (error) {
    console.error('Fetch Reports Error:', error);
    res.status(500).json({ message: 'Помилка при отриманні списку звітів' });
  }
});

// @desc    Створити технічний звіт та оновити статус плану
// @route   POST /api/reports
router.post('/', protect, async (req, res) => {
  try {
    const { objectId, planId, stages, generatedBy } = req.body;

    if (!objectId || !planId || !stages) {
      return res.status(400).json({ message: 'Відсутні обов’язкові дані' });
    }

    const planExists = await CalendarPlan.findById(planId);
    if (!planExists) {
      return res.status(404).json({ message: 'Календарний план не знайдено' });
    }

    const newReport = new ConstructionReport({
      reportNumber: `REP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      objectId,
      planId,
      generatedBy: generatedBy || req.user.lastName || 'Координатор',
      content: { stages }
    });

    const savedReport = await newReport.save();
    
    // Оновлюємо статус плану на "Reported"
    await CalendarPlan.findByIdAndUpdate(planId, { status: 'Reported' });

    res.status(201).json(savedReport);
  } catch (error) {
    console.error('Report Creation Error:', error);
    res.status(500).json({ message: 'Помилка сервера при створенні звіту' });
  }
});

// @desc    Видалити звіт з архіву
// @route   DELETE /api/reports/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const report = await ConstructionReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Звіт не знайдено' });
    }

    await report.deleteOne();
    res.json({ message: 'Звіт видалено з архіву' });
  } catch (error) {
    console.error('Delete Report Error:', error);
    res.status(500).json({ message: 'Помилка при видаленні звіту' });
  }
});

module.exports = router;