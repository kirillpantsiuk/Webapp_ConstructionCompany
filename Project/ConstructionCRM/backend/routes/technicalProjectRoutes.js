const express = require('express');
const router = express.Router();
const TechnicalProject = require('../models/TechnicalProject');
const { protect } = require('../middleware/authMiddleware');

// @desc    Отримати всі технічні проєкти
// @route   GET /api/technical-projects
router.get('/', protect, async (req, res) => {
  try {
    const projects = await TechnicalProject.find({})
      .populate('objectId', 'address area coordinates')
      .populate('taskId', 'name imageUrl'); 
    res.json(projects);
  } catch (error) {
    console.error('Помилка завантаження проєктів:', error.message);
    res.status(500).json({ message: 'Помилка сервера при отриманні проєктів' });
  }
});

// @desc    Створити новий технічний проєкт
// @route   POST /api/technical-projects
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, status, objectId, taskId, fullPlanData } = req.body;

    const projectExists = await TechnicalProject.findOne({ objectId });
    if (projectExists) {
      return res.status(400).json({ message: 'Технічний проєкт для цього об’єкта вже існує' });
    }

    const project = new TechnicalProject({
      name,
      description,
      status: status || 'Active',
      objectId,
      taskId,
      fullPlanData // Зберігаємо детальну структуру плану
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Помилка створення проєкту:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// @desc    Видалити технічний проєкт
// @route   DELETE /api/technical-projects/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await TechnicalProject.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Технічний проєкт успішно видалено' });
    } else {
      res.status(404).json({ message: 'Проєкт не знайдено' });
    }
  } catch (error) {
    console.error('Помилка видалення:', error.message);
    res.status(500).json({ message: 'Помилка сервера при видаленні проєкту' });
  }
});

module.exports = router;