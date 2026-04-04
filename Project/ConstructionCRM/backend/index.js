const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');

// Імпорт маршрутів
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const buildingRoutes = require('./routes/buildingRoutes');
const templateRoutes = require('./routes/templateRoutes'); // 1. Додано імпорт роутів для шаблонів

// Ініціалізація конфігурації
dotenv.config();

// Підключення до бази даних
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Реєстрація маршрутів API
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/building-objects', buildingRoutes);
app.use('/api/templates', templateRoutes); // 2. ПІДКЛЮЧЕНО: Тепер дані будуть доступні за цим посиланням

// Статична папка
app.use('/uploads', express.static('uploads'));

// Головний маршрут
app.get('/', (req, res) => {
  res.send('API будівельної CRM працює. Доступні ендпоінти: /api/users, /api/clients, /api/building-objects, /api/templates');
});

// Обробка неіснуючих маршрутів (404)
app.use((req, res, next) => {
  const error = new Error(`Не знайдено - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Глобальний обробник помилок
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error('--- SERVER ERROR LOG ---');
  console.error(`Method: ${req.method} | URL: ${req.url}`);
  console.error('Stack:', err.stack);
  console.error('------------------------');

  res.status(statusCode).json({
    message: err.message || 'Внутрішня помилка сервера',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено у режимі: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Адреса: http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`FATAL ERROR: ${err.message}`);
  server.close(() => process.exit(1));
});