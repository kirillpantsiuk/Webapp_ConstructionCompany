const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Неавторизовано, токен недійсний' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Неавторизовано, немає токена' });
  }
};

// Мідлвара для обмеження доступу за ролями
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