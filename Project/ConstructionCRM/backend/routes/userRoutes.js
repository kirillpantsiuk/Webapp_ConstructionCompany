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
const { protectAdmin } = require('../middleware/authMiddleware');

// --- ПУБЛІЧНІ МАРШРУТИ ---
router.post('/login', loginUser);

// --- ЗАХИЩЕНІ МАРШРУТИ (Тільки для SuperAdmin) ---

// Реєстрація та отримання списку всіх користувачів
router.route('/register')
  .post(protectAdmin, registerUser);

router.route('/')
  .get(protectAdmin, getAllUsers);

// Видалення та оновлення конкретного користувача за його ID
router.route('/:id')
  .delete(protectAdmin, deleteUser)
  .put(protectAdmin, updateUser);

// Отримання особистого профілю (доступно авторизованим юзерам)
router.get('/profile', protectAdmin, getUserProfile);

module.exports = router;