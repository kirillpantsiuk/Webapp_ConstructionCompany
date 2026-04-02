const express = require('express');
const router = express.Router();
const { 
  loginUser, 
  registerUser, 
  getAllUsers, 
  deleteUser, 
  updateUser,
  getUserProfile 
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// --- ПУБЛІЧНІ МАРШРУТИ ---
// Логін відкритий для всіх користувачів
router.post('/login', loginUser);

// --- МАРШРУТИ ДЛЯ АВТОРИЗОВАНИХ КОРИСТУВАЧІВ ---
// Отримання особистого профілю (доступно всім ролям: Manager, TechnicalCoordinator, SuperAdmin)
router.get('/profile', protect, getUserProfile);

// --- ЗАХИЩЕНІ МАРШРУТИ (Тільки для SuperAdmin) ---
// Реєстрація нових працівників (Менеджерів та Тех. координаторів)
router.post('/register', protect, authorize('SuperAdmin'), registerUser);

// Отримання списку всіх користувачів (тільки для SuperAdmin)
router.get('/', protect, authorize('SuperAdmin'), getAllUsers);

// Видалення та оновлення конкретного користувача за його ID (тільки для SuperAdmin)
router.route('/:id')
  .delete(protect, authorize('SuperAdmin'), deleteUser)
  .put(protect, authorize('SuperAdmin'), updateUser);

module.exports = router;