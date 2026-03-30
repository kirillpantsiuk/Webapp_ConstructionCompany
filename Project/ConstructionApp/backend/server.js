const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(require('cors')());

app.get('/', (req, res) => {
  res.send('API працює...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущено на порті ${PORT}`));
