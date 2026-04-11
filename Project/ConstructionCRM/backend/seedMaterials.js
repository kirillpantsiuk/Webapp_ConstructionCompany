const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Material = require('./models/Material');

dotenv.config();

const materials = [
  // --- ЕТАП 4: ФУНДАМЕНТ ---
  { name: 'Бетон М300 (В22.5) П4', unit: 'м³', price: 2950, availableQuantity: 2000, description: 'Фундамент та плити перекриття', stage: 4 },
  { name: 'Арматура сталева 12 мм', unit: 'т', price: 32500, availableQuantity: 40, description: 'Каркас фундаменту', stage: 4 },
  { name: 'Пісок річковий митий', unit: 'т', price: 520, availableQuantity: 1000, description: 'Для створення подушки фундаменту', stage: 4 },
  { name: 'Щебінь гранітний (20-40)', unit: 'т', price: 880, availableQuantity: 500, description: 'Для основи та дренажу', stage: 4 },
  { name: 'Мастика бітумна (20кг)', unit: 'відро', price: 980, availableQuantity: 60, description: 'Гідроізоляція фундаменту', stage: 4 },
  { name: 'Геотекстиль 200 г/м²', unit: 'м²', price: 45, availableQuantity: 500, description: 'Для розділення шарів ґрунту', stage: 4 },

  // --- ЕТАП 5: СТІНИ ТА ПОКРІВЛЯ (КОРОБКА) ---
  { name: 'Газоблок D400 (600x300x200)', unit: 'м³', price: 3450, availableQuantity: 800, description: 'Зовнішні несучі стіни', stage: 5 },
  { name: 'Цегла рядова М100', unit: 'шт', price: 7.8, availableQuantity: 10000, description: 'Вентканали та перегородки', stage: 5 },
  { name: 'Клей для газоблоку (25кг)', unit: 'мішок', price: 235, availableQuantity: 1500, description: 'Тонкошарова монтажна суміш', stage: 5 },
  { name: 'Брус сосновий (150x150)', unit: 'м³', price: 9200, availableQuantity: 30, description: 'Кроквяна система даху', stage: 5 },
  { name: 'Металочерепиця (0.5мм) Matte', unit: 'м²', price: 385, availableQuantity: 1000, description: 'Фінішне покриття покрівлі', stage: 5 },
  { name: 'Вікно металопластикове (стандарт)', unit: 'шт', price: 6800, availableQuantity: 50, description: 'Енергоефективне скління', stage: 5 },
  { name: 'Супердифузійна мембрана 115г', unit: 'рулон', price: 1850, availableQuantity: 40, description: 'Захист утеплювача покрівлі', stage: 5 },

  // --- ЕТАП 6: ВНУТРІШНЄ ТА ЗОВНІШНЄ ОЗДОБЛЕННЯ ---
  { name: 'Гіпсокартон Knauf (12.5мм)', unit: 'лист', price: 420, availableQuantity: 400, description: 'Обшивка стін та стель', stage: 6 },
  { name: 'Профілі для ГК (CD-60) 3м', unit: 'шт', price: 115, availableQuantity: 600, description: 'Каркас для гіпсокартонних систем', stage: 6 },
  { name: 'Штукатурка гіпсова (30кг)', unit: 'мішок', price: 285, availableQuantity: 500, description: 'Вирівнювання стін під фарбування', stage: 6 },
  { name: 'Ламінат 33 клас (8мм)', unit: 'м²', price: 550, availableQuantity: 600, description: 'Зносостійке підлогове покриття', stage: 6 },
  { name: 'Плитка керамічна (санвузол)', unit: 'м²', price: 720, availableQuantity: 300, description: 'Оздоблення вологих зон', stage: 6 },
  { name: 'Клей для плитки Ceresit CM11', unit: 'мішок', price: 295, availableQuantity: 400, description: 'Для керамічної плитки', stage: 6 },
  { name: 'Фарба інтер’єрна миюча (10л)', unit: 'відро', price: 1850, availableQuantity: 50, description: 'Стіни та стелі', stage: 6 },
  { name: 'Пінопласт ПСБ-С 25 (100мм)', unit: 'м²', price: 185, availableQuantity: 800, description: 'Утеплення фасадів', stage: 6 },
  { name: 'Штукатурка "Баранець" (силікон)', unit: 'відро', price: 1650, availableQuantity: 100, description: 'Декоративний шар фасаду', stage: 6 },
  { name: 'Двері міжкімнатні (комплект)', unit: 'шт', price: 8500, availableQuantity: 20, description: 'З фурнітурою та коробкою', stage: 6 },
  { name: 'Підкладка під ламінат 3мм', unit: 'м²', price: 45, availableQuantity: 600, description: 'Звукоізоляція підлоги', stage: 6 },
  { name: 'Фуга для плитки (2кг)', unit: 'шт', price: 210, availableQuantity: 100, description: 'Затирка міжплиткових швів', stage: 6 }
];

const seedMaterials = async () => {
  try {
    console.log('⏳ Підключення до бази даних...');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('🗑️ Очищення існуючих матеріалів...');
    await Material.deleteMany({});
    
    console.log('🚀 Завантаження нових матеріалів (3 етапи)...');
    await Material.insertMany(materials);
    
    console.log(`✅ Успішно додано ${materials.length} матеріалів!`);
    process.exit();
  } catch (err) {
    console.error('❌ Помилка сидування:', err);
    process.exit(1);
  }
};

seedMaterials();