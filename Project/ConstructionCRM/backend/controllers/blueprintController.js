const Blueprint = require('../models/Blueprint');

// @desc    Отримати всі креслення для конкретного об'єкта
// @route   GET /api/blueprints/:objectId
// @access  Private (TechnicalCoordinator)
const getBlueprintsByObject = async (req, res) => {
  try {
    const { objectId } = req.params;
    
    // Шукаємо всі креслення в базі, що належать цьому об'єкту
    const blueprints = await Blueprint.find({ objectId });
    
    if (!blueprints) {
      return res.status(404).json({ message: 'Креслень для цього об’єкта не знайдено' });
    }

    res.status(200).json(blueprints);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера при отриманні креслень', error: error.message });
  }
};

module.exports = { getBlueprintsByObject };