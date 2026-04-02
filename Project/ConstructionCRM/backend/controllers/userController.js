const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * @desc    Генерація JWT токена
 */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error("❌ КРИТИЧНА ПОМИЛКА: JWT_SECRET не знайдено в .env файлі!");
  }
  // ВИПРАВЛЕНО: параметр має бути expiresIn, а не expires
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

/**
 * @route   POST /api/users/login
 * @desc    Автентифікація користувача (Email/Login) та отримання токена
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Шукаємо користувача за email АБО за логіном
    const user = await User.findOne({ 
      $or: [{ email: email }, { login: email }] 
    });

    // 2. Перевірка наявності користувача (захист від null)
    if (!user) {
      console.log(`⚠️ Користувача ${email} не знайдено`);
      return res.status(401).json({ message: 'Невірний email/логін або пароль' });
    }

    // 3. Перевірка пароля
    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      console.log(`✅ Користувач ${user.login} успішно увійшов`);
      res.json({
        _id: user._id,
        login: user.login,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      console.log(`❌ Невірний пароль для ${email}`);
      res.status(401).json({ message: 'Невірний email/логін або пароль' });
    }
  } catch (error) {
    console.error("!!! ПОМИЛКА ЛОГІНУ:", error.message);
    res.status(500).json({ message: 'Внутрішня помилка сервера при вході', error: error.message });
  }
};

/**
 * @route   POST /api/users/register
 * @desc    Реєстрація персоналу (Тільки для SuperAdmin)
 * @access  Private (SuperAdmin)
 */
const registerUser = async (req, res) => {
  try {
    const { 
      login, password, role, email, 
      specialization, experience, department, phone 
    } = req.body;

    // 1. Обмеження ролей
    const allowedRoles = ['Manager', 'TechnicalCoordinator'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ 
        message: 'Помилка: Ви можете реєструвати лише Менеджерів або Технічних координаторів' 
      });
    }

    // 2. Валідація пароля
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Пароль занадто слабкий (мін. 8 символів, велика літера, цифра, спецсимвол)' 
      });
    }

    // 3. Специфічна валідація для ролей
    if (role === 'Manager') {
      const phoneRegex = /^\+\d{10,15}$/;
      if (!phone || !phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Для менеджера потрібен телефон у форматі +380...' });
      }
    }

    if (role === 'TechnicalCoordinator') {
      if (experience === undefined || Number(experience) < 0) {
        return res.status(400).json({ message: 'Досвід не може бути від’ємним' });
      }
    }

    // 4. Перевірка дублікатів
    const userExists = await User.findOne({ $or: [{ email }, { login }] });
    if (userExists) {
      return res.status(400).json({ message: 'Користувач з таким Email або Логіном вже існує' });
    }

    // 5. Створення
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
      res.status(201).json({ 
        message: `Співробітника (${role}) успішно зареєстровано`,
        _id: user._id,
        login: user.login
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Помилка реєстрації', error: error.message });
  }
};

/**
 * @desc    Отримання списку всіх користувачів
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Помилка завантаження списку' });
  }
};

/**
 * @desc    Видалення користувача
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

    if (req.user && req.user._id.toString() === req.params.id.toString()) {
      return res.status(400).json({ message: 'Ви не можете видалити власну картку' });
    }

    if (user.role === 'SuperAdmin') {
      const adminCount = await User.countDocuments({ role: 'SuperAdmin' });
      if (adminCount <= 1) return res.status(400).json({ message: 'Неможливо видалити останнього адміністратора' });
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'Користувача видалено успішно' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при видаленні' });
  }
};

/**
 * @desc    Оновлення даних користувача
 */
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

    if (req.body.password) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json({ message: 'Пароль не відповідає вимогам безпеки' });
      }
      user.password = req.body.password;
    }

    user.login = req.body.login || user.login;
    user.email = req.body.email || user.email;
    
    if (req.body.role && req.body.role !== 'SuperAdmin') {
        user.role = req.body.role;
    }

    if (user.role === 'Manager') {
      user.department = req.body.department || user.department;
      user.phone = req.body.phone || user.phone;
      user.specialization = undefined;
      user.experience = undefined;
    } else if (user.role === 'TechnicalCoordinator') {
      user.specialization = req.body.specialization || user.specialization;
      user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;
      user.department = undefined;
      user.phone = undefined;
    }

    const updatedUser = await user.save();
    res.json({ 
      _id: updatedUser._id, 
      login: updatedUser.login, 
      email: updatedUser.email, 
      role: updatedUser.role 
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка оновлення', error: error.message });
  }
};

/**
 * @desc    Отримання профілю поточного користувача
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Профіль не знайдено' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
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