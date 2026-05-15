const express = require('express');
const router = express.Router();
const ConstructionReport = require('../models/ConstructionReport');
const CalendarPlan = require('../models/CalendarPlan');
const { protect } = require('../middleware/authMiddleware');

// @desc    Створити технічний звіт та оновити статус плану
// @route   POST /api/reports
router.post('/', protect, async (req, res) => {
  try {
    const { objectId, planId, stages, generatedBy } = req.body;

    // 1. Валідація: перевіряємо, чи всі необхідні дані прийшли з фронтенду
    if (!objectId || !planId || !stages) {
      return res.status(400).json({ 
        message: 'Відсутні обов’язкові дані (ID об’єкта, ID плану або контент етапів)' 
      });
    }

    // 2. Перевіряємо, чи існує такий план у базі
    const planExists = await CalendarPlan.findById(planId);
    if (!planExists) {
      return res.status(404).json({ message: 'Календарний план не знайдено в базі' });
    }

    // 3. Створюємо новий звіт
    const newReport = new ConstructionReport({
      reportNumber: `REP-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Надійніший унікальний номер
      objectId,
      planId,
      generatedBy: generatedBy || 'Система',
      content: { stages }
    });

    const savedReport = await newReport.save();

    // 4. Оновлюємо статус календарного плану
    // Використовуємо { new: true }, щоб отримати вже оновлений об'єкт, якщо захочеш його повернути
    await CalendarPlan.findByIdAndUpdate(planId, { status: 'Reported' });

    console.log(`✅ Звіт ${savedReport.reportNumber} створено для об'єкта ${objectId}`);
    
    res.status(201).json(savedReport);
  } catch (error) {
    console.error('Report Creation Error:', error);
    res.status(500).json({ 
      message: 'Внутрішня помилка сервера при створенні звіту',
      error: error.message 
    });
  }
});

module.exports = router;