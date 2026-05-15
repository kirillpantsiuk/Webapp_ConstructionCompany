const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Перевірка наявності заголовка Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Витягуємо токен з рядка "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // КРИТИЧНО: Перевірка на випадок, якщо фронтенд надіслав "null" або "undefined" як рядок
      if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: 'Авторизація відхилена: токен порожній' });
      }

      // 2. Верифікація токена
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Отримання користувача з БД без пароля
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Користувача, пов’язаного з цим токеном, не знайдено' });
      }

      // Передаємо управління наступній мідлварі або роуту
      return next(); 
    } catch (error) {
      // Ловимо помилки (jwt malformed, jwt expired тощо)
      console.error('JWT Error:', error.message);
      return res.status(401).json({ message: 'Неавторизовано, токен недійсний або пошкоджений' });
    }
  }

  // 4. Якщо токен взагалі не було надано
  if (!token) {
    return res.status(401).json({ message: 'Неавторизовано, доступ заборонено без токена' });
  }
};

/**
 * Мідлвара для обмеження доступу за ролями
 * Використання: router.get('/admin-only', protect, authorize('admin'), (req, res) => ...)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Доступ заборонено для вашої ролі (${req.user ? req.user.role : 'Гість'})` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };