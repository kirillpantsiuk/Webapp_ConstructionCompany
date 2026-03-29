const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1/ConstructionApp");
    console.log("✅ MongoDB підключено");
  } catch (error) {
    console.error("❌ Помилка підключення:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
