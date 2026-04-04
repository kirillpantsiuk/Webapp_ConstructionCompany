const TemplateProject = require('../models/TemplateProject');

// @desc    Отримати всі опорні плани
// @route   GET /api/templates
const getTemplates = async (req, res) => {
  try {
    const templates = await TemplateProject.find({});
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Помилка отримання шаблонів' });
  }
};

module.exports = { getTemplates };