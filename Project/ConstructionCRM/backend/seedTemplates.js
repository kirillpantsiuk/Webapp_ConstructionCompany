const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TemplateProject = require('./models/TemplateProject');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const templates = [
  // КОМПАКТ (S)
  { name: 'S-1 "Смарт Базис"', configuration: "1 кімната + 1 суміщений санвузол (душ)", estimatedArea: 35, rooms: 1, bathrooms: 1, techRooms: 0 },
  { name: 'S-2 "Смарт Оптіма"', configuration: "1 кімната + 1 суміщений санвузол (ванна) + ніша під кухню", estimatedArea: 42, rooms: 1, bathrooms: 1, techRooms: 0 },
  { name: 'H-1 "Холідей"', configuration: "1 кімната + 1 санвузол + засклена веранда", estimatedArea: 48, rooms: 1, bathrooms: 1, techRooms: 0 },
  { name: 'B-1 "Бачелор"', configuration: "1 кімната + 2 санвузли (основний та гостьовий)", estimatedArea: 55, rooms: 1, bathrooms: 2, techRooms: 0 },
  { name: 'T-1 "Техно Міні"', configuration: "1 кімната + 1 санвузол + техн. приміщення (котельня)", estimatedArea: 50, rooms: 1, bathrooms: 1, techRooms: 1 },

  // МЕДІУМ (M)
  { name: 'M-1 "Класик Дуо"', configuration: "2 житлові кімнати + 1 суміщений санвузол", estimatedArea: 65, rooms: 2, bathrooms: 1, techRooms: 0 },
  { name: 'M-2 "Сімейний Стандарт"', configuration: "2 житлові кімнати + ванна + туалет (окремо)", estimatedArea: 72, rooms: 2, bathrooms: 2, techRooms: 0 },
  { name: 'M-3 "Інженерний Вектор"', configuration: "2 житлові кімнати + техн. приміщення (насосна) + 1 санвузол", estimatedArea: 75, rooms: 2, bathrooms: 1, techRooms: 1 },
  { name: 'M-4 "Комфорт Хаус"', configuration: "2 житлові кімнати + 1 санвузол + гардеробна", estimatedArea: 80, rooms: 2, bathrooms: 1, techRooms: 0 },
  { name: 'M-5 "Сервіс Плюс"', configuration: "2 житлові кімнати + 2 санвузли + котельня", estimatedArea: 88, rooms: 2, bathrooms: 2, techRooms: 1 },

  // ГРАНД (G)
  { name: 'G-1 "Тріо Баланс"', configuration: "3 житлові кімнати + 1 суміщений санвузол + котельня", estimatedArea: 95, rooms: 3, bathrooms: 1, techRooms: 1 },
  { name: 'G-2 "Майстер Тріо"', configuration: "3 житлові кімнати + 2 санвузли (один приватний в спальні)", estimatedArea: 110, rooms: 3, bathrooms: 2, techRooms: 0 },
  { name: 'G-3 "Техно Про"', configuration: "3 житлові кімнати + техн. приміщення + ванна + туалет (окремо)", estimatedArea: 115, rooms: 3, bathrooms: 2, techRooms: 1 },
  { name: 'G-4 "Родинний Маєток"', configuration: "3 житлові кімнати + 2 санвузли + гардеробна + котельня", estimatedArea: 125, rooms: 3, bathrooms: 2, techRooms: 1 },
  { name: 'G-5 "Універсал"', configuration: "3 житлові кімнати + 2 санвузли + окрема пральня", estimatedArea: 130, rooms: 3, bathrooms: 2, techRooms: 1 },

  // СПЕЦІАЛЬНІ (E/W/L)
  { name: 'E-1 "Енерго Смарт"', configuration: "1 кімната + техн. блок (АКБ/Інвертори) + санвузол", estimatedArea: 55, rooms: 1, bathrooms: 1, techRooms: 1 },
  { name: 'E-2 "Автоном Оптіма"', configuration: "2 кімнати + розширене техн. приміщення + 2 санвузли", estimatedArea: 92, rooms: 2, bathrooms: 2, techRooms: 1 },
  { name: 'W-1 "Ворк-Хаус"', configuration: "2 кімнати + майстерня + санвузол + вітальня", estimatedArea: 105, rooms: 2, bathrooms: 1, techRooms: 1 },
  { name: 'W-2 "Аква Пуре"', configuration: "3 кімнати + вузол очистки води + 2 санвузли", estimatedArea: 120, rooms: 3, bathrooms: 2, techRooms: 1 },
  { name: 'L-1 "Преміум Соло"', configuration: "4 житлові кімнати + 2 санвузли + техн. приміщення + кладова", estimatedArea: 150, rooms: 4, bathrooms: 2, techRooms: 2 }
];

const seedData = async () => {
  try {
    await TemplateProject.deleteMany(); // Очищаємо, щоб не було дублів
    await TemplateProject.insertMany(templates);
    console.log('✅ Успішно завантажено 20 опорних планів для одноповерхових будинків!');
    process.exit();
  } catch (error) {
    console.error(`❌ Помилка: ${error.message}`);
    process.exit(1);
  }
};

seedData();