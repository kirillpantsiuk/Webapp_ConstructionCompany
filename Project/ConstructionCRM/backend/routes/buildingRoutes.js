const express = require('express');
const router = express.Router();
const { 
  getBuildingObjects, 
  createBuildingObject, 
  updateBuildingObject, 
  deleteBuildingObject 
} = require('../controllers/buildingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('Manager'), getBuildingObjects)
  .post(protect, authorize('Manager'), createBuildingObject);

router.route('/:id')
  .put(protect, authorize('Manager'), updateBuildingObject)
  .delete(protect, authorize('Manager'), deleteBuildingObject);

module.exports = router;