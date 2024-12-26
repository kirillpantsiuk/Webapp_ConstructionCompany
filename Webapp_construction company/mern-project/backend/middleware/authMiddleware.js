// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Проверяем, есть ли токен в заголовках запроса
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Извлекаем токен из заголовка
      token = req.headers.authorization.split(' ')[1];

      // Верифицируем токен
      const decoded = jwt.verify(token, 'your_jwt_secret');

      // Получаем пользователя по ID из токена
      req.user = await User.findById(decoded.userId).select('-password');

      // Переходим к следующему middleware или маршруту
      next();
    } catch (error) {
      // Если токен недействителен, возвращаем ошибку
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Если токен отсутствует, возвращаем ошибку
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
