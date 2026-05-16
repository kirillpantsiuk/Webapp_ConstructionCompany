const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Worker = require('./models/Worker');
const connectDB = require('./config/db');

dotenv.config();

// Спеціалізації (відповідають логіці фільтрації в UI)
const specializations = [
  'Водій самоскида (Підготовка)', 
  'Різноробочий (Підготовка)',
  'Екскаваторник (Земляні роботи)', 
  'Геодезист (Розмітка)', 
  'Бетоняр-арматурник (Фундамент)', 
  'Зварювальник (Фундамент)',
  'Муляр (Монтаж стін)', 
  'Монтажник металоконструкцій (Монтаж)', 
  'Покрівельник (Монтаж даху)', 
  'Кранівник (Монтаж)', 
  'Монтажник вікон та дверей (Монтаж)',
  'Електрик-монтажник (Оздоблення)', 
  'Сантехнік-опалювальник (Оздоблення)', 
  'Маляр-штукатур (Оздоблення)', 
  'Плиточник-облицювальник (Оздоблення)', 
  'Гіпсокартонщик (Оздоблення)', 
  'Фасадчик (Оздоблення)',
  'Виконроб (Керівництво)', 
  'Головний інженер (Керівництво)'
];

const firstNames = ['Остап', 'Северин', 'Данило', 'Маркіян', 'Любомир', 'Святослав', 'Олекса', 'Мирослав', 'Назар', 'Богдан', 'Тарас', 'Ярема', 'Захар', 'Гліб', 'Дем’ян', 'Лук’ян', 'Устим', 'Радомир', 'Олесь', 'Пилип', 'Гордій', 'Корній'];
const lastNames = ['Залізняк', 'Кривоніс', 'Перебийніс', 'Тягнибок', 'Нетудихата', 'Загубиколесо', 'Паливода', 'Вихрист', 'Непийвода', 'Вернигора', 'Крутиголова', 'Мамай', 'Гамалія', 'Сірко', 'Дорошенко', 'Сагайдачний', 'Гонта', 'Тютюнник', 'Чорновіл', 'Побережний', 'Чурай', 'Тягнирядно', 'Неїжпапа', 'Добривечір', 'Синьоокий', 'Кривошапка', 'Білокінь', 'Чорноус', 'Різник', 'Котигорошко', 'Варивода', 'Засядьвовк', 'Низькошапка', 'Небаба', 'Криворучко', 'Держикрай', 'Вернидуб', 'Затуливітер', 'Покотиполе', 'Вбийвовк'];

const phonePrefixes = ['067', '068', '096', '097', '098', '050', '066', '095', '099', '063', '073', '093'];

const generatePhone = () => {
  const prefix = phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)];
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `+38${prefix}${number}`;
};

const seedWorkers = async () => {
  try {
    await connectDB();

    // 1. Очищення бази — це гарантує, що не буде "старих" зайнятих робітників
    await Worker.deleteMany();
    console.log('🗑️ Базу очищено. Починаємо заповнення...');

    const workers = [];
    const TOTAL_WORKERS = 200; 

    for (let i = 0; i < TOTAL_WORKERS; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const spec = specializations[i % specializations.length];
      
      workers.push({
        firstName: fName,
        lastName: lName,
        specialization: spec,
        isAvailable: true, // <--- ГАРАНТОВАНА СВОБОДА
        contacts: generatePhone()
      });
    }

    await Worker.insertMany(workers);
    
    console.log('--- 👷 РЕЗУЛЬТАТ ---');
    console.log(`✅ Успішно додано ${workers.length} вільних фахівців.`);
    console.log(`📊 Розподіл: приблизно по ${Math.floor(200/specializations.length)} осіб на кожну спеціалізацію.`);
    console.log('--------------------');
    
    process.exit();
  } catch (error) {
    console.error(`❌ Помилка: ${error.message}`);
    process.exit(1);
  }
};

seedWorkers();