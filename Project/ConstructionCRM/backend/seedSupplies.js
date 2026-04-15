const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AdditionalMaterial = require('./models/AdditionalMaterial');
const Tool = require('./models/Tool');

dotenv.config();

const addMats = [
  { name: 'Саморізи по дереву 45мм', unit: 'уп (500шт)', price: 210, stage: 5 },
  { name: 'Піна монтажна 750мл', unit: 'балон', price: 285, stage: 5 },
  { name: 'Стрічка малярна 48мм', unit: 'рулон', price: 95, stage: 6 },
  { name: 'Дюбель-цвях 6х40', unit: 'уп (100шт)', price: 140, stage: 6 },
  { name: 'Герметик силіконовий', unit: 'шт', price: 175, stage: 6 },
  { name: 'Диск відрізний 125мм', unit: 'шт', price: 35, stage: 5 },
  { name: 'Рукавиці робочі', unit: 'пара', price: 45, stage: 4 },
  { name: 'Плівка захисна 20м2', unit: 'шт', price: 80, stage: 6 },
  { name: 'Скотч армований', unit: 'рулон', price: 160, stage: 5 },
  { name: 'Електроди 3мм', unit: 'уп (2.5кг)', price: 420, stage: 5 },
  { name: 'Цвяхи 100мм', unit: 'кг', price: 85, stage: 5 },
  { name: 'Хрестики для плитки', unit: 'уп', price: 40, stage: 6 },
  { name: 'Відро будівельне 12л', unit: 'шт', price: 110, stage: 4 },
  { name: 'Мастило WD-40', unit: 'шт', price: 240, stage: 5 },
  { name: 'Мішки для сміття', unit: 'уп', price: 120, stage: 6 },
  { name: 'Грунтовка 10л', unit: 'кан', price: 380, stage: 6 },
  { name: 'Маяки штукатурні', unit: 'шт', price: 42, stage: 6 },
  { name: 'Стяжки нейлонові', unit: 'уп', price: 90, stage: 5 },
  { name: 'Валик велюровий', unit: 'шт', price: 155, stage: 6 },
  { name: 'Пензель 50мм', unit: 'шт', price: 65, stage: 6 },
  { name: 'Наждачний папір', unit: 'м', price: 50, stage: 6 },
  { name: 'Кріплення ES-60', unit: 'шт', price: 15, stage: 6 },
  { name: 'Антисептик для дерева', unit: 'кан', price: 550, stage: 5 },
  { name: 'Вязальний дріт', unit: 'кг', price: 130, stage: 4 },
  { name: 'Олівець будівельний', unit: 'шт', price: 20, stage: 4 },
  { name: 'Анкер 10х100', unit: 'шт', price: 35, stage: 4 },
  { name: 'Розчинник 0.5л', unit: 'шт', price: 75, stage: 6 },
  { name: 'Біта PH2', unit: 'шт', price: 45, stage: 5 },
  { name: 'Бур SDS+ 6х160', unit: 'шт', price: 85, stage: 6 },
  { name: 'Фуга для швів 2кг', unit: 'шт', price: 230, stage: 6 }
];

const toolData = [
  { name: 'Перфоратор Bosch', price: 6800 },
  { name: 'Шуруповерт Makita', price: 4500 },
  { name: 'Болгарка DeWalt', price: 3400 },
  { name: 'Бетонозмішувач 125л', price: 9200 },
  { name: 'Лазерний рівень', price: 4100 },
  { name: 'Генератор 3кВт', price: 18500 },
  { name: 'Драбина алюмінієва', price: 3200 },
  { name: 'Тачка будівельна', price: 2100 },
  { name: 'Зварювальний апарат', price: 4800 },
  { name: 'Компресор 50л', price: 7500 },
  { name: 'Будівельний пилосос', price: 6200 },
  { name: 'Міксер для розчину', price: 3100 },
  { name: 'Електролобзик', price: 2600 },
  { name: 'Відбійний молоток', price: 11500 },
  { name: 'Набір ключів', price: 2200 },
  { name: 'Молоток-обценьки', price: 450 },
  { name: 'Кувалда 5кг', price: 850 },
  { name: 'Лопата штикова', price: 480 },
  { name: 'Правило 2.5м', price: 750 },
  { name: 'Шпатель фасадний', price: 320 },
  { name: 'Плиткоріз ручний', price: 2800 },
  { name: 'Степлер будівельний', price: 420 },
  { name: 'Рівень 2м', price: 650 },
  { name: 'Сокира', price: 720 },
  { name: 'Ножівка по дереву', price: 550 },
  { name: 'Плоскогубці', price: 380 },
  { name: 'Рулетка 8м', price: 410 },
  { name: 'Пістолет для піни', price: 550 },
  { name: 'Лом', price: 620 },
  { name: 'Набір викруток', price: 750 }
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await AdditionalMaterial.deleteMany({});
  await Tool.deleteMany({});
  await AdditionalMaterial.insertMany(addMats);
  await Tool.insertMany(toolData);
  console.log('✅ Сід виконано!');
  process.exit();
};
seed();