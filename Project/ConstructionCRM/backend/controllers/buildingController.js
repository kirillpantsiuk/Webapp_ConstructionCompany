const BuildingObject = require('../models/BuildingObject');

// @desc    Отримати всі об'єкти з даними клієнтів
// @route   GET /api/building-objects
const getBuildingObjects = async (req, res) => {
  try {
    const objects = await BuildingObject.find({})
      .populate('clientId', 'surname firstName patronymic')
      .sort({ createdAt: -1 });
    res.json(objects);
  } catch (error) {
    res.status(500).json({ message: 'Помилка отримання списку об’єктів', error: error.message });
  }
};

// @desc    Створити новий об'єкт
// @route   POST /api/building-objects
const createBuildingObject = async (req, res) => {
  try {
    const newObject = await BuildingObject.create(req.body);
    res.status(201).json(newObject);
  } catch (error) {
    res.status(400).json({ message: 'Помилка при створенні об’єкта', error: error.message });
  }
};

// @desc    Оновити дані об'єкта
// @route   PUT /api/building-objects/:id
const updateBuildingObject = async (req, res) => {
  try {
    const updated = await BuildingObject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Помилка оновлення', error: error.message });
  }
};

// @desc    Видалити об'єкт
// @route   DELETE /api/building-objects/:id
const deleteBuildingObject = async (req, res) => {
  try {
    await BuildingObject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Об’єкт будівництва видалено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка видалення', error: error.message });
  }
};

module.exports = { getBuildingObjects, createBuildingObject, updateBuildingObject, deleteBuildingObject };