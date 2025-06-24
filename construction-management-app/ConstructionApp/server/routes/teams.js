const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Team = require('../models/Team');

// Отримати всі бригади (для прорабів)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'foreman')
    return res.status(403).json({ msg: 'Доступ заборонено' });

  try {
    const teams = await Team.find().populate('members', 'username role');
    res.json(teams);
  } catch (err) {
    console.error('Помилка при отриманні бригад:', err.message);
    res.status(500).json({ msg: 'Помилка сервера' });
  }
});

// Створити нову бригаду
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'foreman')
    return res.status(403).json({ msg: 'Доступ лише для прорабів' });

  const { name, members } = req.body;

  try {
    const team = await Team.create({ name, members });
    res.status(201).json(team);
  } catch (err) {
    console.error('Помилка при створенні бригади:', err.message);
    res.status(500).json({ msg: 'Не вдалося створити бригаду' });
  }
});

// Оновити бригаду
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'foreman')
    return res.status(403).json({ msg: 'Доступ лише для прорабів' });

  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ msg: 'Бригаду не знайдено' });

    team.name = req.body.name ?? team.name;
    team.members = req.body.members ?? team.members;
    await team.save();

    res.json(team);
  } catch (err) {
    console.error('Помилка при оновленні бригади:', err.message);
    res.status(500).json({ msg: 'Не вдалося оновити бригаду' });
  }
});

// Видалити бригаду
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'foreman')
    return res.status(403).json({ msg: 'Доступ лише для прорабів' });

  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Бригаду видалено' });
  } catch (err) {
    console.error('Помилка при видаленні бригади:', err.message);
    res.status(500).json({ msg: 'Не вдалося видалити бригаду' });
  }
});

module.exports = router;
