const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db.js');

// --- Імпорт маршрутів ---
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

// НОВІ МАРШРУТИ: Додаткові матеріали, Інструменти та Відомості комплектації
const additionalMaterialRoutes = require('./routes/additionalMaterialRoutes');
const toolRoutes = require('./routes/toolRoutes');
const projectSupplyRoutes = require('./routes/projectSupplyRoutes');

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

// НОВІ ЕНДПОЇНТИ
app.use('/api/additional-materials', additionalMaterialRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/project-supplies', projectSupplyRoutes);

// --- Статичні файли ---
// Обов'язково для відображення креслень (blueprints)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Головний маршрут для перевірки ---
app.get('/', (req, res) => {
  res.send(`
    <h1>API будівельної CRM працює</h1>
    <p>Доступні основні ендпоінти:</p>
    <ul>
      <li>/api/users</li>
      <li>/api/building-objects</li>
      <li>/api/technical-projects</li>
      <li>/api/project-supplies (Матеріали та Інструменти)</li>
      <li>/api/tools</li>
      <li>/api/additional-materials</li>
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

// Глобальний обробник помилок (Error Middleware)
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
  console.log(`📡 База даних підключена, API готове до роботи.`);
});

// Обробка критичних помилок (наприклад, збій БД)
process.on('unhandledRejection', (err, promise) => {
  console.error(`🔴 КРИТИЧНА ПОМИЛКА: ${err.message}`);
  server.close(() => process.exit(1));
});