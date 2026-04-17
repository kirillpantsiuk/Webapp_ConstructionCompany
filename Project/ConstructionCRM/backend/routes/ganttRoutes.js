const express = require('express');
const router = express.Router();
const GanttChart = require('../models/GanttChart'); 
const { protect } = require('../middleware/authMiddleware');

// POST /api/gantt-charts
router.post('/', protect, async (req, res) => {
  try {
    const { tasks, timelines, planId } = req.body;

    const ganttChart = await GanttChart.findOneAndUpdate(
      { planId },
      { tasks, timelines },
      { returnDocument: 'after', upsert: true }
    );

    res.status(201).json(ganttChart);
  } catch (error) {
    console.error('Помилка збереження Gantt:', error);
    res.status(400).json({ message: 'Помилка збереження діаграми Ганта' });
  }
});

module.exports = router;