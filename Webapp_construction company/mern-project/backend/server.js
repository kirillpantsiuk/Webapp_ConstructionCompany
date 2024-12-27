// server.js или ваш файл сервера
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const SECRET_KEY = 'your_secret_key'; // Замените на ваш секретный ключ

// Подключение к базе данных
mongoose.connect('mongodb://localhost:27017/your_database', { useNewUrlParser: true, useUnifiedTopology: true });

// Модель User
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Builder', 'Foreman', 'ProjectManager', 'Customer', 'Director'], required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true }
});

const User = mongoose.model('User', userSchema);

// Модель Team
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Team = mongoose.model('Team', teamSchema);

// Middleware для проверки JWT токена
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Middleware для проверки роли Foreman
const checkForemanRole = (req, res, next) => {
  if (req.user && req.user.role === 'Foreman') {
    next();
  } else {
    res.sendStatus(403);
  }
};

// Маршруты для пользователей
app.get('/api/users', authenticateJWT, checkForemanRole, async (req, res) => {
  try {
    const users = await User.find().populate('profileId');
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Маршруты для команд
app.post('/api/teams', authenticateJWT, checkForemanRole, async (req, res) => {
  const { name, members } = req.body;
  const newTeam = new Team({ name, members });
  try {
    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/teams', authenticateJWT, checkForemanRole, async (req, res) => {
  try {
    const teams = await Team.find().populate('members');
    res.status(200).json(teams);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/teams/:id', authenticateJWT, checkForemanRole, async (req, res) => {
  const { id } = req.params;
  const { name, members } = req.body;
  try {
    const updatedTeam = await Team.findByIdAndUpdate(id, { name, members }, { new: true }).populate('members');
    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/teams/:id', authenticateJWT, checkForemanRole, async (req, res) => {
  const { id } = req.params;
  try {
    await Team.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Запуск сервера
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
