const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Worker = require('./models/Worker');
const connectDB = require('./config/db');

dotenv.config();

// Спеціалізації, що СУВОРО збігаються з логікою getRequiredSpecialization
const specializations = [
  // ПІДГОТОВКА ТА ЗЕМЛЯНІ РОБОТИ
  'Водій самоскида (Підготовка)', 
  'Різноробочий (Підготовка)',
  'Екскаваторник (Земляні роботи)', 
  
  // РОЗМІТКА
  'Геодезист (Розмітка)', 
  
  // ФУНДАМЕНТ
  'Бетоняр-арматурник (Фундамент)', 
  'Зварювальник (Фундамент)',
  
  // МОНТАЖ (Стіни, дах, армопояс)
  'Муляр (Монтаж стін)', 
  'Монтажник металоконструкцій (Монтаж)', 
  'Покрівельник (Монтаж даху)', 
  'Кранівник (Монтаж)', 
  'Монтажник вікон та дверей (Монтаж)',
  
  // ОЗДОБЛЕННЯ
  'Електрик-монтажник (Оздоблення)', 
  'Сантехнік-опалювальник (Оздоблення)', 
  'Маляр-штукатур (Оздоблення)', 
  'Плиточник-облицювальник (Оздоблення)', 
  'Гіпсокартонщик (Оздоблення)', 
  'Фасадчик (Оздоблення)',
  
  // КЕРІВНИЦТВО (Для етапу Здача)
  'Виконроб (Керівництво)', 
  'Головний інженер (Керівництво)'
];

// Колоритні українські імена
const firstNames = [
  'Остап', 'Северин', 'Данило', 'Маркіян', 'Любомир', 'Святослав', 'Олекса', 'Мирослав', 
  'Назар', 'Богдан', 'Тарас', 'Ярема', 'Захар', 'Гліб', 'Дем’ян', 'Лук’ян', 'Устим',
  'Радомир', 'Олесь', 'Пилип', 'Гордій', 'Корній'
];

// Легендарні та кумедні козацькі прізвища
const lastNames = [
  'Залізняк', 'Кривоніс', 'Перебийніс', 'Тягнибок', 'Нетудихата', 'Загубиколесо', 
  'Паливода', 'Вихрист', 'Непийвода', 'Вернигора', 'Крутиголова', 'Мамай', 'Гамалія', 
  'Сірко', 'Дорошенко', 'Сагайдачний', 'Гонта', 'Тютюнник', 'Чорновіл', 'Побережний', 
  'Чурай', 'Тягнирядно', 'Неїжпапа', 'Добривечір', 'Синьоокий', 'Кривошапка', 'Білокінь', 
  'Чорноус', 'Різник', 'Котигорошко', 'Варивода', 'Засядьвовк', 'Низькошапка', 'Небаба',
  'Криворучко', 'Держикрай', 'Вернидуб', 'Затуливітер', 'Покотиполе', 'Вбийвовк'
];

const phonePrefixes = ['067', '068', '096', '097', '098', '050', '066', '095', '099', '063', '073', '093'];

const generatePhone = () => {
  const prefix = phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)];
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `+38${prefix}${number}`;
};

const seedWorkers = async () => {
  try {
    await connectDB();

    // Повне очищення перед записом
    await Worker.deleteMany();
    console.log('🗑️ Стара база робітників видалена');

    const workers = [];
    const TOTAL_WORKERS = 200; // Велика база для вільного вибору ресурсів

    for (let i = 0; i < TOTAL_WORKERS; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      // Рівномірно розподіляємо спеціалізації
      const spec = specializations[i % specializations.length];
      
      workers.push({
        firstName: fName,
        lastName: lName,
        specialization: spec,
        isAvailable: true,
        contacts: generatePhone()
      });
    }

    await Worker.insertMany(workers);
    
    console.log('--- ✅ УСПІХ ---');
    console.log(`🚀 Додано ${workers.length} фахівців до бази.`);
    console.log(`👷 Приклади: ${workers[0].lastName} ${workers[0].firstName}, ${workers[5].lastName} ${workers[5].firstName}`);
    console.log(`📊 Тепер на кожен етап припадає ~10-12 вільних робітників.`);
    console.log('----------------');
    
    process.exit();
  } catch (error) {
    console.error(`❌ Критична помилка: ${error.message}`);
    process.exit(1);
  }
};

seedWorkers();