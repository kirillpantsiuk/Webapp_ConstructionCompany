const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const initSuperAdmin = require('./config/initSuperAdmin');
const superAdminRoutes = require('./routes/superAdminRoutes');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Виклик ініціалізації супер адміна
initSuperAdmin();

// Тестовий маршрут
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Маршрути для супер адміна
app.use('/api/superadmin', superAdminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
