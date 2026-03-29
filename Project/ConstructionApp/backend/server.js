const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Завантажуємо змінні середовища
dotenv.config();

// Підключаємо базу даних
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Тестовий маршрут
app.get('/', (req, res) => {
  res.send('API працює 🚀');
});

// Авторизація
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Сервер запущено на порту ${PORT}`));
