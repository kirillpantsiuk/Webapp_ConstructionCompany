const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * @desc    Генерація JWT токена
 * @param   {string} id - ID користувача з бази даних
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Токен дійсний 30 днів
  });
};

/**
 * @route   POST /api/users/login
 * @desc    Автентифікація користувача та отримання токена
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Шукаємо користувача за email
    const user = await User.findOne({ email });

    // Перевіряємо чи існує користувач та чи збігається пароль
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        login: user.login,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Невірний email або пароль' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Помилка при вході', error: error.message });
  }
};

/**
 * @route   POST /api/users/register
 * @desc    Реєстрація нового користувача (Менеджера або ТехКоординатора)
 * @access  Private (Тільки для SuperAdmin)
 */
const registerUser = async (req, res) => {
  try {
    const { 
      login, 
      password, 
      role, 
      email, 
      specialization, 
      experience, 
      department, 
      phone 
    } = req.body;

    // 1. Перевірка чи користувач вже існує
    const userExists = await User.findOne({ $or: [{ email }, { login }] });
    if (userExists) {
      return res.status(400).json({ message: 'Користувач з таким Email або логіном вже існує' });
    }

    // 2. Створення об'єкту нового користувача
    // Пароль буде захешований автоматично завдяки pre('save') у моделі User.js
    const user = await User.create({
      login,
      password,
      role,
      email,
      // Поля для Технічного Координатора
      specialization: role === 'TechnicalCoordinator' ? specialization : undefined,
      experience: role === 'TechnicalCoordinator' ? experience : undefined,
      // Поля для Менеджера
      department: role === 'Manager' ? department : undefined,
      phone: role === 'Manager' ? phone : undefined,
    });

    if (user) {
      res.status(201).json({
        message: 'Користувача успішно зареєстровано',
        user: {
          _id: user._id,
          login: user.login,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(400).json({ message: 'Невірні дані користувача' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Помилка при реєстрації', error: error.message });
  }
};

/**
 * @route   GET /api/users/profile
 * @desc    Отримання профілю поточного користувача
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  // req.user заповнюється в authMiddleware
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      login: user.login,
      email: user.email,
      role: user.role,
      details: {
        department: user.department,
        phone: user.phone,
        specialization: user.specialization,
        experience: user.experience
      }
    });
  } else {
    res.status(404).json({ message: 'Користувача не знайдено' });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getUserProfile,
};