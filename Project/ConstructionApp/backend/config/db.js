const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1/ConstructionApp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB успішно підключено');
  } catch (error) {
    console.error('Помилка підключення до MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
