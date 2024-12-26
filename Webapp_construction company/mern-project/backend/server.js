// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const workScheduleRoutes = require('./routes/workScheduleRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/work-schedules', workScheduleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
