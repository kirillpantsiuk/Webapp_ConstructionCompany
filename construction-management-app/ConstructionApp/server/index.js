require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// 🔐 Аутентифікація
app.use('/api/auth', require('./routes/auth'));

// 🧱 Управління бригадами
app.use('/api/teams', require('./routes/teams'));

// 🧑‍💼 Отримати користувачів за роллю
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
