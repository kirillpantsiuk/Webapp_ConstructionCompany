const express = require('express');
const router = express.Router();
const SiteInspection = require('../models/SiteInspection');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Отримати всі акти огляду або створити новий
// @route   GET /api/site-inspections
// @route   POST /api/site-inspections
// @access  Private (Admin, Manager, TechnicalCoordinator)
router.route('/')
  .get(protect, authorize('Admin', 'Manager', 'TechnicalCoordinator'), async (req, res) => {
    try {
      // Знаходимо всі огляди та підтягуємо дані про об'єкт та інспектора
      const inspections = await SiteInspection.find({})
        .populate('objectId', 'address area')
        .populate('inspectorId', 'login surname firstName');
      
      res.json(inspections);
    } catch (error) {
      res.status(500).json({ message: 'Помилка отримання даних огляду', error: error.message });
    }
  })
  .post(protect, authorize('TechnicalCoordinator', 'Admin'), async (req, res) => {
    try {
      const { 
        objectId, soilType, groundwaterLevel, relief, 
        electricity, water, gas, accessRoads, 
        truckAccess, storageArea, existingStructures, 
        neighborConstraints, powerLines, recommendations 
      } = req.body;

      // Створюємо новий запис, автоматично призначаючи ID поточного користувача як інспектора
      const inspection = new SiteInspection({
        objectId,
        inspectorId: req.user._id,
        soilType,
        groundwaterLevel,
        relief,
        electricity,
        water,
        gas,
        accessRoads,
        truckAccess,
        storageArea,
        existingStructures,
        neighborConstraints,
        powerLines,
        recommendations
      });

      const createdInspection = await inspection.save();
      res.status(201).json(createdInspection);
    } catch (error) {
      res.status(400).json({ message: 'Помилка створення акту огляду', error: error.message });
    }
  });

// @desc    Отримати, оновити або видалити конкретний акт
// @route   GET /api/site-inspections/:id
// @route   PUT /api/site-inspections/:id
// @route   DELETE /api/site-inspections/:id
// @access  Private (TechnicalCoordinator, Admin)
router.route('/:id')
  .get(protect, authorize('Admin', 'Manager', 'TechnicalCoordinator'), async (req, res) => {
    try {
      const inspection = await SiteInspection.findById(req.params.id)
        .populate('objectId')
        .populate('inspectorId', 'login surname firstName');

      if (inspection) {
        res.json(inspection);
      } else {
        res.status(404).json({ message: 'Акт огляду не знайдено' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Серверна помилка', error: error.message });
    }
  })
  .put(protect, authorize('TechnicalCoordinator', 'Admin'), async (req, res) => {
    try {
      const inspection = await SiteInspection.findById(req.params.id);

      if (inspection) {
        // Оновлюємо поля
        inspection.soilType = req.body.soilType || inspection.soilType;
        inspection.groundwaterLevel = req.body.groundwaterLevel || inspection.groundwaterLevel;
        inspection.relief = req.body.relief || inspection.relief;
        inspection.electricity = req.body.electricity || inspection.electricity;
        inspection.water = req.body.water || inspection.water;
        inspection.gas = req.body.gas || inspection.gas;
        inspection.accessRoads = req.body.accessRoads || inspection.accessRoads;
        inspection.truckAccess = req.body.truckAccess !== undefined ? req.body.truckAccess : inspection.truckAccess;
        inspection.storageArea = req.body.storageArea || inspection.storageArea;
        inspection.existingStructures = req.body.existingStructures || inspection.existingStructures;
        inspection.neighborConstraints = req.body.neighborConstraints || inspection.neighborConstraints;
        inspection.powerLines = req.body.powerLines !== undefined ? req.body.powerLines : inspection.powerLines;
        inspection.recommendations = req.body.recommendations || inspection.recommendations;

        const updatedInspection = await inspection.save();
        res.json(updatedInspection);
      } else {
        res.status(404).json({ message: 'Об’єкт для оновлення не знайдено' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Некоректні дані для оновлення', error: error.message });
    }
  })
  .delete(protect, authorize('TechnicalCoordinator', 'Admin'), async (req, res) => {
    try {
      const inspection = await SiteInspection.findById(req.params.id);

      if (inspection) {
        await inspection.deleteOne();
        res.json({ message: 'Акт огляду успішно видалено' });
      } else {
        res.status(404).json({ message: 'Акт огляду не знайдено' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Помилка при видаленні', error: error.message });
    }
  });

module.exports = router;