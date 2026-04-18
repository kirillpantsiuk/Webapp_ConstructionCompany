const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Worker = require('./models/Worker');
const connectDB = require('./config/db');

dotenv.config();

// Спеціалізації, що ідеально збігаються з фільтрами у TechnicalDashboard
const specializations = [
  // КРОК 01: Підготовка
  'Водій самоскида (Підготовка)', 
  'Різноробочий (Підготовка)',
  
  // КРОК 02: Розмітка
  'Геодезист (Розмітка)', 
  
  // КРОК 03: Земляні роботи
  'Екскаваторник (Земляні роботи)', 
  
  // КРОК 04: Фундамент
  'Бетоняр-арматурник (Фундамент)', 
  'Зварювальник (Фундамент)',
  
  // КРОК 05: Монтаж (Стіни, дах, перекриття)
  'Муляр (Монтаж стін)', 
  'Монтажник металоконструкцій (Монтаж)', 
  'Покрівельник (Монтаж даху)', 
  'Кранівник (Монтаж)', 
  'Монтажник вікон та дверей (Монтаж)',
  
  // КРОК 06: Оздоблення (Внутрішні та зовнішні роботи)
  'Електрик-монтажник (Оздоблення)', 
  'Сантехнік-опалювальник (Оздоблення)', 
  'Маляр-штукатур (Оздоблення)', 
  'Плиточник-облицювальник (Оздоблення)', 
  'Гіпсокартонщик (Оздоблення)', 
  'Фасадчик (Оздоблення)',
  
  // Керування (Додатково)
  'Виконроб (Керівництво)', 
  'Головний інженер (Керівництво)'
];

// Розширена база імен
const firstNames = [
  'Олександр', 'Микола', 'Сергій', 'Дмитро', 'Андрій', 'Володимир', 'Іван', 'Василь', 
  'Юрій', 'Артем', 'Віктор', 'Максим', 'Олег', 'Ігор', 'Богдан', 'Денис', 'Роман', 
  'Павло', 'Михайло', 'Тарас', 'Олексій', 'Валерій', 'Анатолій', 'Костянтин', 'Євген', 
  'Святослав', 'Ярослав', 'Назар', 'Вадим', 'Руслан', 'Остап', 'Маркіян', 'Григорій',
  'Леонід', 'Петро', 'Степан', 'Матвій', 'Тимофій', 'Макар', 'Артур', 'Антон'
];

// Розширена база прізвищ
const lastNames = [
  'Шевченко', 'Коваленко', 'Бондаренко', 'Ткаченко', 'Кравченко', 'Олійник', 'Гончаренко', 
  'Захарченко', 'Лисенко', 'Мельник', 'Савченко', 'Поліщук', 'Приходько', 'Мороз', 
  'Кузьменко', 'Ковальчук', 'Павленко', 'Козак', 'Марченко', 'Антонюк', 'Данилюк', 
  'Тищенко', 'Дяченко', 'Остапенко', 'Клименко', 'Мельничук', 'Панченко', 'Костенко', 
  'Степаненко', 'Мазур', 'Хоменко', 'Герасименко', 'Бойко', 'Литвин', 'Романенко',
  'Іваненко', 'Петренко', 'Сидоренко', 'Гриценко', 'Левченко', 'Романчук', 'Гаврилюк'
];

// Префікси українських операторів
const phonePrefixes = ['067', '068', '096', '097', '098', '050', '066', '095', '099', '063', '073', '093'];

const generatePhone = () => {
  const prefix = phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)];
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `+38${prefix}${number}`;
};

const seedWorkers = async () => {
  try {
    await connectDB();

    // Очищуємо колекцію перед заповненням
    await Worker.deleteMany();
    console.log('🗑️ Стара база робітників видалена');

    const workers = [];
    const TOTAL_WORKERS = 150; // Збільшена кількість для масштабного тестування

    // Генеруємо робітників
    for (let i = 0; i < TOTAL_WORKERS; i++) {
      const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      // Рівномірний розподіл професій по черзі
      const spec = specializations[i % specializations.length];
      
      workers.push({
        firstName: randomFirstName,
        lastName: randomLastName,
        specialization: spec,
        isAvailable: true, // Всі робітники першочергово ВІЛЬНІ
        contacts: generatePhone()
      });
    }

    // Зберігаємо в базу даних
    await Worker.insertMany(workers);
    
    // Аналітика для консолі
    const specsCount = workers.reduce((acc, w) => {
      acc[w.specialization] = (acc[w.specialization] || 0) + 1;
      return acc;
    }, {});

    console.log('---');
    console.log(`🚀 База успішно наповнена!`);
    console.log(`👷 Додано робітників: ${workers.length}`);
    console.log(`📊 Розподіл за спеціальностями (в середньому по ${Math.floor(TOTAL_WORKERS / specializations.length)} чол.):`);
    console.log(specsCount);
    console.log(`✅ Усі робітники встановлені як "Вільні"`);
    console.log('---');
    
    process.exit();
  } catch (error) {
    console.error(`❌ Критична помилка: ${error.message}`);
    process.exit(1);
  }
};

seedWorkers();