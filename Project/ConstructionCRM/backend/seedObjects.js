const mongoose = require('mongoose');
const dotenv = require('dotenv');
const BuildingObject = require('./models/BuildingObject');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // 1. Видаляємо всі існуючі об'єкти
    await BuildingObject.deleteMany({});
    console.log('🗑 Всі старі об’єкти видалено');

    // 2. Створюємо новий об'єкт з твоїм Google Drive ID
    // ВСТАВ СЮДИ РЕАЛЬНИЙ ID КЛІЄНТА З ТВОЄЇ БАЗИ
    const realClientId = "69cf6eaab7fa71ab194413ef"; 

    const newObject = {
      address: "с. Вільна Терешківка, вул. Центральна",
      coordinates: "49.1234, 33.5678",
      area: 120,
      description: "Одноповерховий житловий будинок",
      clientId: realClientId,
      googleDriveFolderId: "18u0d4jUxCNtjQ7y1Ph8rjQk9PLBgcmz9" // Твій ID папки
    };

    await BuildingObject.create(newObject);
    console.log('✅ Новий об’єкт успішно створено з прив’язкою до Google Drive');

    process.exit();
  } catch (error) {
    console.error('Помилка:', error);
    process.exit(1);
  }
};

seedData();