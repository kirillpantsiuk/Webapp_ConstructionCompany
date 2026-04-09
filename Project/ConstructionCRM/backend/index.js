const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Додано для роботи зі шляхами
const connectDB = require('./config/db.js');

// Імпорт маршрутів
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const buildingRoutes = require('./routes/buildingRoutes');
const templateRoutes = require('./routes/templateRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes');
const siteInspectionRoutes = require('./routes/siteInspectionRoutes'); 
const driveRoutes = require('./routes/driveRoutes');
const blueprintRoutes = require('./routes/blueprintRoutes'); // НОВИЙ МАРШРУТ ДЛЯ КРЕСЛЕНЬ

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
app.use('/api/templates', templateRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/site-inspections', siteInspectionRoutes);
app.use('/api/drive', driveRoutes); 
app.use('/api/blueprints', blueprintRoutes); // ПІДКЛЮЧЕННЯ КРЕСЛЕНЬ (MONGODB)

// Статична папка для завантажень (Робимо її доступною для браузера)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Головний маршрут
app.get('/', (req, res) => {
  res.send('API будівельної CRM працює. Доступні ендпоінти: /api/users, /api/clients, /api/building-objects, /api/blueprints');
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
  res.status(statusCode).json({
    message: err.message || 'Внутрішня помилка сервера',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено: http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`FATAL ERROR: ${err.message}`);
  server.close(() => process.exit(1));
});