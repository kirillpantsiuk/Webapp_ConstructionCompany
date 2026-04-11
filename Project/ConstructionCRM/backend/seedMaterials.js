const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Налаштування dotenv
dotenv.config();

// Схема моделі прямо у файлі для гарантії роботи сида
const materialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  availableQuantity: { type: Number, default: 0 }
}, { timestamps: true });

// Перевірка чи модель вже існує, щоб уникнути помилок при перезапуску
const Material = mongoose.models.Material || mongoose.model('Material', materialSchema);

const materials = [
  // --- 1. ФУНДАМЕНТ ТА СПЕЦТЕХНІКА ---
  {
    name: 'Бетон М300 (В22.5) П4',
    description: 'Високоякісна бетонна суміш для фундаментів та плит перекриття з підвищеною рухливістю.',
    unit: 'м³',
    price: 2950,
    availableQuantity: 1000
  },
  {
    name: 'Арматура сталева А500С (12 мм)',
    description: 'Гарячекатана сталь періодичного профілю для зміцнення залізобетонних конструкцій.',
    unit: 'т',
    price: 32500,
    availableQuantity: 25
  },
  {
    name: 'Пісок річковий митий',
    description: 'Очищений від глини пісок для створення амортизаційної подушки під фундамент.',
    unit: 'т',
    price: 520,
    availableQuantity: 800
  },
  {
    name: 'Щебінь гранітний (фракція 20-40)',
    description: 'Для бетонних сумішей та влаштування дренажних систем.',
    unit: 'т',
    price: 880,
    availableQuantity: 400
  },
  {
    name: 'Мастика бітумна гідроізоляційна (20кг)',
    description: 'Обмазувальна гідроізоляція для фундаментів та підземних споруд.',
    unit: 'відро',
    price: 980,
    availableQuantity: 100
  },

  // --- 2. СТІНОВІ МАТЕРІАЛИ ---
  {
    name: 'Газоблок D400 (600x300x200) AEROC',
    description: 'Стіновий блок підвищеної енергоефективності для зовнішніх несучих стін.',
    unit: 'м³',
    price: 3450,
    availableQuantity: 500
  },
  {
    name: 'Газоблок перегородковий (600x200x100)',
    description: 'Легкий матеріал для швидкого зведення міжкімнатних перегородок.',
    unit: 'м³',
    price: 3600,
    availableQuantity: 200
  },
  {
    name: 'Керамоблок (250x380x238)',
    description: 'Поризована кераміка для будівництва "теплих" будинків без додаткового утеплення.',
    unit: 'шт',
    price: 95,
    availableQuantity: 5000
  },
  {
    name: 'Цегла рядова М100',
    description: 'Повнотіла керамічна цегла для внутрішніх стін та вентиляційних каналів.',
    unit: 'шт',
    price: 7.80,
    availableQuantity: 15000
  },
  {
    name: 'Клей для газоблоку Baumit (25кг)',
    description: 'Морозостійка тонкошарова суміш з високою адгезією.',
    unit: 'мішок',
    price: 235,
    availableQuantity: 600
  },

  // --- 3. ПОКРІВЛЯ ТА ПИЛОМАТЕРІАЛИ ---
  {
    name: 'Брус сосновий (150x150) свіжопилений',
    description: 'Для кроквяної системи та мауерлатів. Деревина 1-го сорту.',
    unit: 'м³',
    price: 9200,
    availableQuantity: 40
  },
  {
    name: 'Дошка обрізна (25x150x6000)',
    description: 'Для влаштування обрешітки та чорнової підлоги.',
    unit: 'м³',
    price: 8500,
    availableQuantity: 60
  },
  {
    name: 'Металочерепиця ArcelorMittal (0.5мм) Matte',
    description: 'Преміальне покриття з високим вмістом цинку (225 г/м²), колір Антрацит.',
    unit: 'м²',
    price: 365,
    availableQuantity: 800
  },
  {
    name: 'Мінвата Rockwool (100мм) 35 щільність',
    description: 'Базальтовий утеплювач для скатної покрівлі та мансард.',
    unit: 'пачка (6 м²)',
    price: 980,
    availableQuantity: 150
  },
  {
    name: 'Супердифузійна мембрана Strotex',
    description: 'Трьохшарова підпокрівельна плівка для захисту утеплювача від вологи.',
    unit: 'рулон (75 м²)',
    price: 1850,
    availableQuantity: 30
  },

  // --- 4. ІНЖЕНЕРНІ МЕРЕЖІ ---
  {
    name: 'Кабель ВВГнг-П 3х2.5 Одескабель',
    description: 'Силовий мідний кабель, що не підтримує горіння. Стандарт для розеток.',
    unit: 'м.п.',
    price: 62,
    availableQuantity: 3000
  },
  {
    name: 'Автоматичний вимикач Eaton 16A',
    description: 'Однополюсний пристрій захисту електричного кола.',
    unit: 'шт',
    price: 145,
    availableQuantity: 100
  },
  {
    name: 'Труба для теплої підлоги Rehau (16мм)',
    description: 'Труба із зшитого поліетилену з кисневим бар\'єром PE-Xa.',
    unit: 'м.п.',
    price: 48,
    availableQuantity: 2500
  },
  {
    name: 'Септик бетонний (кільце КС 15-9)',
    description: 'Залізобетонне кільце для влаштування локальної каналізації.',
    unit: 'шт',
    price: 1600,
    availableQuantity: 15
  },

  // --- 5. ФАСАД ТА ОЗДОБЛЕННЯ ---
  {
    name: 'Пінопласт ПСБ-С 25 (100мм)',
    description: 'Матеріал для утеплення фасадів методом "легкий-мокрий".',
    unit: 'м²',
    price: 175,
    availableQuantity: 600
  },
  {
    name: 'Сітка фасадна склотканинна (160г/м²)',
    description: 'Лугостійка сітка для армування захисного шару фасаду.',
    unit: 'рулон (50м)',
    price: 1150,
    availableQuantity: 40
  },
  {
    name: 'Декоративна штукатурка "Баранець" (25кг)',
    description: 'Готова силіконова суміш, стійка до атмосферних впливів та вигорання.',
    unit: 'відро',
    price: 1450,
    availableQuantity: 80
  },
  {
    name: 'Гіпсокартон вологостійкий Knauf (12.5мм)',
    description: 'Для обшивки стін та стель у вологих приміщеннях (санвузли, кухні).',
    unit: 'лист',
    price: 420,
    availableQuantity: 200
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Підключено до MongoDB для сидування матеріалів');

    // Очищення колекції перед сидуванням
    await Material.deleteMany({});
    console.log('🗑️ Колекцію матеріалів очищено');

    // Вставка даних
    await Material.insertMany(materials);
    console.log(`🚀 Успішно додано ${materials.length} професійних матеріалів до бази!`);

    process.exit();
  } catch (err) {
    console.error('❌ Помилка сидування:', err);
    process.exit(1);
  }
};

seedDB();