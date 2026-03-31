const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * @desc    Генерація JWT токена
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
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
    const user = await User.findOne({ email });

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
 * @desc    Реєстрація нового користувача з валідацією (Тільки для SuperAdmin)
 * @access  Private
 */
const registerUser = async (req, res) => {
  try {
    const { 
      login, password, role, email, 
      specialization, experience, department, phone 
    } = req.body;

    // 1. ВАЛІДАЦІЯ ПАРОЛЯ
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Пароль занадто слабкий. Має бути мінімум 8 символів, одна велика літера, одна цифра та спецсимвол (!@#$%^&*)' 
      });
    }

    // 2. ВАЛІДАЦІЯ ТЕЛЕФОНУ ТА ДОСВІДУ
    if (role === 'Manager') {
      const phoneRegex = /^\+\d{10,15}$/;
      if (!phone || !phoneRegex.test(phone)) {
        return res.status(400).json({ 
          message: 'Для менеджера номер телефону обов’язковий у форматі +380...' 
        });
      }
    }

    if (role === 'TechnicalCoordinator') {
      if (experience === undefined || Number(experience) < 0) {
        return res.status(400).json({ 
          message: 'Досвід роботи не може бути від’ємним числом' 
        });
      }
    }

    const userExists = await User.findOne({ $or: [{ email }, { login }] });
    if (userExists) {
      return res.status(400).json({ message: 'Користувач з таким Email або Логіном вже існує' });
    }

    const user = await User.create({
      login,
      password,
      role,
      email,
      specialization: role === 'TechnicalCoordinator' ? specialization : undefined,
      experience: role === 'TechnicalCoordinator' ? experience : undefined,
      department: role === 'Manager' ? department : undefined,
      phone: role === 'Manager' ? phone : undefined,
    });

    if (user) {
      res.status(201).json({ message: 'Користувача успішно зареєстровано' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Помилка реєстрації', error: error.message });
  }
};

/**
 * @route   GET /api/users
 * @desc    Отримання списку всіх користувачів
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Не вдалося завантажити список', error: error.message });
  }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Видалення користувача
 * @access  Private (Admin)
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    if (req.user && req.user._id.toString() === req.params.id.toString()) {
      return res.status(400).json({ message: 'Ви не можете видалити самого себе' });
    }

    if (user.role === 'SuperAdmin') {
      const adminCount = await User.countDocuments({ role: 'SuperAdmin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Неможливо видалити останнього адміністратора' });
      }
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'Користувача видалено успішно' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при видаленні', error: error.message });
  }
};

/**
 * @route   PUT /api/users/:id
 * @desc    Оновлення даних користувача з перевіркою валідності
 * @access  Private (Admin)
 */
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Валідація телефону
      if (req.body.role === 'Manager' || (user.role === 'Manager' && req.body.phone)) {
        const phoneToTest = req.body.phone || user.phone;
        const phoneRegex = /^\+\d{10,15}$/;
        if (!phoneRegex.test(phoneToTest)) {
          return res.status(400).json({ message: 'Некоректний формат телефону (+380...)' });
        }
      }

      // Валідація досвіду
      if (req.body.role === 'TechnicalCoordinator' || (user.role === 'TechnicalCoordinator' && req.body.experience !== undefined)) {
        const expToTest = req.body.experience !== undefined ? req.body.experience : user.experience;
        if (Number(expToTest) < 0) {
          return res.status(400).json({ message: 'Досвід роботи не може бути від’ємним числом' });
        }
      }

      // Валідація нового пароля
      if (req.body.password) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(req.body.password)) {
          return res.status(400).json({ message: 'Новий пароль не відповідає вимогам безпеки' });
        }
        user.password = req.body.password;
      }

      user.login = req.body.login || user.login;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      
      if (user.role === 'Manager') {
        user.department = req.body.department || user.department;
        user.phone = req.body.phone || user.phone;
        // Очищення полів іншої ролі
        user.specialization = undefined;
        user.experience = undefined;
      } else if (user.role === 'TechnicalCoordinator') {
        user.specialization = req.body.specialization || user.specialization;
        user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;
        // Очищення полів іншої ролі
        user.department = undefined;
        user.phone = undefined;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        login: updatedUser.login,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'Користувача не знайдено' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Помилка оновлення', error: error.message });
  }
};

/**
 * @route   GET /api/users/profile
 * @desc    Отримання профілю поточного користувача
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserProfile,
};