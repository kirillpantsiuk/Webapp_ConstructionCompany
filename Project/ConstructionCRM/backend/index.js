const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes'); // Імпортуємо роути

// 1. Завантаження змінних середовища
dotenv.config();

// 2. Підключення до бази даних
connectDB();

// 3. Ініціалізація додатка (Створюємо 'app' ПЕРЕД використанням)
const app = express();

// 4. Мідлвари
app.use(cors());
app.use(express.json()); // Щоб сервер розумів JSON у тілі запиту

// 5. Підключення маршрутів (Тепер 'app' вже існує)
app.use('/api/users', userRoutes);

// Базовий тестовий роут
app.get('/', (req, res) => {
  res.send('API будівельної CRM працює...');
});

// 6. Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порту ${PORT}`);
});