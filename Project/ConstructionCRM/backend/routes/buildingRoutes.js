const express = require('express');
const router = express.Router();
const { 
  getBuildingObjects, 
  createBuildingObject, 
  updateBuildingObject, 
  deleteBuildingObject 
} = require('../controllers/buildingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Додаємо TechnicalCoordinator до методу GET, щоб він міг бачити список адрес
router.route('/')
  .get(protect, authorize('Manager', 'TechnicalCoordinator'), getBuildingObjects)
  .post(protect, authorize('Manager'), createBuildingObject);

router.route('/:id')
  .put(protect, authorize('Manager'), updateBuildingObject)
  .delete(protect, authorize('Manager'), deleteBuildingObject);

module.exports = router;