const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Підключення до MongoDB за допомогою рядка з .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB підключено: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Помилка підключення до БД: ${error.message}`);
    process.exit(1); // Зупиняємо процес у разі збою
  }
};

module.exports = connectDB;