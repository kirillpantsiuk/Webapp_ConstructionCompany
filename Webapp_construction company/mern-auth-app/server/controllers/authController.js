const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
exports.register = async (req, res) => {
  const { username, password, role, email, address } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      username,
      password,
      role,
      email,
      address,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role, // Включаем роль пользователя в токен
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 }, // 100 hours
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, role: user.role } }); // Возвращаем токен и информацию о пользователе
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role, // Включаем роль пользователя в токен
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 }, // 100 hours
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, role: user.role } }); // Возвращаем токен и информацию о пользователе
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Verify Token
exports.verifyToken = (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  if (!token) {
    return res.status(401).json({ isValid: false, msg: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ isValid: false, msg: 'Token is not valid' });
    }
    res.json({ isValid: true, user: decoded.user });
  });
};
