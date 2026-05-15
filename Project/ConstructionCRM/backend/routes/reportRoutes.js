const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { 
  getReports, 
  createReport, 
  updateReportStatus, 
  deleteReport 
} = require('../controllers/reportController');

// ВСІ авторизовані можуть бачити звіти та їхні статуси
router.get('/', protect, getReports);

// ТІЛЬКИ Технічний координатор може створювати та видаляти звіти
router.post('/', protect, authorize('TechnicalCoordinator'), createReport);
router.delete('/:id', protect, authorize('TechnicalCoordinator'), deleteReport);

// ТІЛЬКИ Менеджер може змінювати статуси етапів
router.put('/:id', protect, authorize('Manager'), updateReportStatus);

module.exports = router;