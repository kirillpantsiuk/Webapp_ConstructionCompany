const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db.js');

// --- 1. Імпорт маршрутів (БЕЗ ДУБЛІКАТІВ) ---
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const buildingRoutes = require('./routes/buildingRoutes');
const templateRoutes = require('./routes/templateRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes');
const siteInspectionRoutes = require('./routes/siteInspectionRoutes'); 
const blueprintRoutes = require('./routes/blueprintRoutes'); 
const reportRoutes = require('./routes/reportRoutes'); // Тільки один раз!

const materialRoutes = require('./routes/materialRoutes');
const technicalProjectRoutes = require('./routes/technicalProjectRoutes');
const additionalMaterialRoutes = require('./routes/additionalMaterialRoutes');
const toolRoutes = require('./routes/toolRoutes');
const projectSupplyRoutes = require('./routes/projectSupplyRoutes');
const workerRoutes = require('./routes/workerRoutes');
const calendarPlanRoutes = require('./routes/calendarPlanRoutes');
const ganttRoutes = require('./routes/ganttRoutes');

// Ініціалізація конфігурації
dotenv.config();

// Підключення до бази даних
connectDB();

const app = express();

// --- 2. Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 3. Реєстрація маршрутів API (БЕЗ ДУБЛІКАТІВ) ---
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/building-objects', buildingRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/site-inspections', siteInspectionRoutes);
app.use('/api/blueprints', blueprintRoutes); 

// Матеріали та Техплани
app.use('/api/materials', materialRoutes);
app.use('/api/technical-projects', technicalProjectRoutes);

// ЗВІТИ (Реєструємо ОДИН раз)
app.use('/api/reports', reportRoutes);

// Ендпоінти комплектації
app.use('/api/additional-materials', additionalMaterialRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/project-supplies', projectSupplyRoutes);

// Робітники, Календарні плани та Гант
app.use('/api/workers', workerRoutes);
app.use('/api/calendar-plans', calendarPlanRoutes);
app.use('/api/gantt-charts', ganttRoutes);

// --- 4. Статичні файли ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 5. Головний маршрут для перевірки ---
app.get('/', (req, res) => {
  res.send(`
    <h1 style="font-family: sans-serif; color: #38bdf8;">🚀 API будівельної CRM працює</h1>
    <p>Доступні основні розділи: Користувачі, Об'єкти, Плани, Звіти.</p>
  `);
});

// --- 6. Обробка помилок ---
app.use((req, res, next) => {
  const error = new Error(`Не знайдено - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Внутрішня помилка сервера',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// --- 7. Запуск сервера ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Сервер успішно запущено на порту ${PORT}`);
  console.log(`📡 API готове до роботи.`);
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`🔴 КРИТИЧНА ПОМИЛКА: ${err.message}`);
  server.close(() => process.exit(1));
});