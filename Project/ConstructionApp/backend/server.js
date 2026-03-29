const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors"); // 👈 додай для роботи фронтенду
const authRoutes = require("./routes/auth"); // 👈 імпорт маршруту авторизації

const app = express();

connectDB();

app.use(cors()); // 👈 дозволяє запити з порту 3000
app.use(express.json());

// тестовий маршрут
app.get("/", (req, res) => res.send("API працює"));

// 👇 підключаємо авторизацію
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));
