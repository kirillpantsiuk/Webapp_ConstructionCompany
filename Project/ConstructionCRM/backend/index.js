const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db.js');

// --- Імпорт маршрутів ---
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const buildingRoutes = require('./routes/buildingRoutes');
const templateRoutes = require('./routes/templateRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes');
const siteInspectionRoutes = require('./routes/siteInspectionRoutes'); 
const blueprintRoutes = require('./routes/blueprintRoutes'); 

// Маршрути для Матеріалів та Технічних Проєктів
const materialRoutes = require('./routes/materialRoutes');
const technicalProjectRoutes = require('./routes/technicalProjectRoutes');

// Маршрути для Додаткових матеріалів, Інструментів та Відомостей комплектації
const additionalMaterialRoutes = require('./routes/additionalMaterialRoutes');
const toolRoutes = require('./routes/toolRoutes');
const projectSupplyRoutes = require('./routes/projectSupplyRoutes');

// Маршрути для Робітників (включаючи bulk-release)
const workerRoutes = require('./routes/workerRoutes');

// Маршрути: Календарне планування (Графіки робіт)
const calendarPlanRoutes = require('./routes/calendarPlanRoutes');

// НОВИЙ МАРШРУТ: Діаграма Ганта
const ganttRoutes = require('./routes/ganttRoutes');

// НОВИЙ МАРШРУТ: Звіти з будівництва (ДОДАНО)


// Ініціалізація конфігурації
dotenv.config();

// Підключення до бази даних
connectDB();

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Реєстрація маршрутів API ---
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

// Ендпоінти комплектації
app.use('/api/additional-materials', additionalMaterialRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/project-supplies', projectSupplyRoutes);

// Реєстрація робітників
app.use('/api/workers', workerRoutes);

// Реєстрація календарних планів та Ганта
app.use('/api/calendar-plans', calendarPlanRoutes);
app.use('/api/gantt-charts', ganttRoutes);

// Реєстрація звітів (ДОДАНО)
app.use('/api/reports', reportRoutes);

// --- Статичні файли ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Головний маршрут для перевірки ---
app.get('/', (req, res) => {
  res.send(`
    <h1 style="font-family: sans-serif; color: #38bdf8;">🚀 API будівельної CRM працює</h1>
    <p>Доступні ендпоінти:</p>
    <ul style="font-family: monospace; line-height: 1.6;">
      <li>/api/users - Користувачі</li>
      <li>/api/building-objects - Об'єкти будівництва</li>
      <li>/api/technical-projects - Технічні плани</li>
      <li>/api/calendar-plans - Календарні графіки робіт</li>
      <li>/api/gantt-charts - Дані діаграми Ганта</li>
      <li>/api/workers - Реєстр робітників (в т.ч. bulk-release)</li>
      <li>/api/reports - Звіти з будівництва</li>
      <li>/api/project-supplies - Відомості комплектації</li>
      <li>/api/tools - База інструментів</li>
      <li>/api/additional-materials - Додаткові матеріали</li>
    </ul>
  `);
});

// --- Обробка помилок ---

// 404 - Маршрут не знайдено
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

// --- Запуск сервера ---
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порту ${PORT}`);
  console.log(`📡 API готове до планування об'єктів та обробки звітів.`);
});

// Обробка критичних помилок
process.on('unhandledRejection', (err, promise) => {
  console.error(`🔴 КРИТИЧНА ПОМИЛКА: ${err.message}`);
  server.close(() => process.exit(1));
});