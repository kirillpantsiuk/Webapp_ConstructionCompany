const express = require('express');
const router = express.Router();
const { 
  createClient, 
  getClients, 
  updateClient, 
  deleteClient 
} = require('../controllers/clientController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Маршрут для '/' (відповідає за /api/clients)
router.route('/')
  .get(protect, authorize('Manager'), getClients)   // Отримати всіх (для таблиці)
  .post(protect, authorize('Manager'), createClient); // Створити нового

// Маршрут для '/:id' (відповідає за /api/clients/ID_КЛІЄНТА)
router.route('/:id')
  .put(protect, authorize('Manager'), updateClient)    // Оновити дані
  .delete(protect, authorize('Manager'), deleteClient); // Видалити

module.exports = router;