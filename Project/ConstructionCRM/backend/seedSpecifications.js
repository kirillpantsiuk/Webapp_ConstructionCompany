const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Material = require('./models/Material');
const Specification = require('./models/Specification');

dotenv.config();

const seedSpecs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Підключено до MongoDB для генерації специфікацій');

    const materials = await Material.find();

    if (materials.length === 0) {
      console.log('❌ База матеріалів порожня! Спочатку запустіть node seedMaterials.js');
      process.exit(1);
    }

    const getMatId = (name) => materials.find(m => m.name.includes(name))?._id;
    const getPrice = (name) => materials.find(m => m.name.includes(name))?.price || 0;

    await Specification.deleteMany({});

    // Створюємо 3 професійні специфікації для різних типів робіт
    const data = [
      {
        // СПЕЦИФІКАЦІЯ №1: НУЛЬОВИЙ ЦИКЛ (ФУНДАМЕНТ)
        projectId: new mongoose.Types.ObjectId(),
        materialsList: [
          { materialId: getMatId('Бетон М300'), quantity: 52 }, // 52 м3
          { materialId: getMatId('Арматура сталева 12 мм'), quantity: 1.8 }, // 1.8 т
          { materialId: getMatId('Пісок річковий'), quantity: 30 }, // 30 т
          { materialId: getMatId('Щебінь гранітний'), quantity: 20 }, // 20 т
          { materialId: getMatId('Мастика бітумна'), quantity: 8 } // 8 відер
        ]
      },
      {
        // СПЕЦИФІКАЦІЯ №2: КОРОБКА БУДИНКУ (СТІНИ ТА МЕРЕЖІ)
        projectId: new mongoose.Types.ObjectId(),
        materialsList: [
          { materialId: getMatId('Газоблок D400'), quantity: 75 }, // 75 м3
          { materialId: getMatId('Клей для газоблоку'), quantity: 90 }, // 90 мішків
          { materialId: getMatId('Цегла рядова М100'), quantity: 4500 }, // 4500 шт
          { materialId: getMatId('Кабель ВВГнг-П 3х2.5'), quantity: 400 }, // 400 м.п.
          { materialId: getMatId('Автоматичний вимикач'), quantity: 12 } // 12 шт
        ]
      },
      {
        // СПЕЦИФІКАЦІЯ №3: ПОКРІВЛЯ ТА ФАСАД
        projectId: new mongoose.Types.ObjectId(),
        materialsList: [
          { materialId: getMatId('Металочерепиця ArcelorMittal'), quantity: 185 }, // 185 м2
          { materialId: getMatId('Брус сосновий'), quantity: 6.5 }, // 6.5 м3
          { materialId: getMatId('Мінвата Rockwool'), quantity: 40 }, // 40 пачок
          { materialId: getMatId('Супердифузійна мембрана'), quantity: 4 }, // 4 рулони
          { materialId: getMatId('Пінопласт ПСБ-С 25'), quantity: 120 } // 120 м2
        ]
      }
    ];

    // Розрахунок загальної вартості (totalCost)
    const finalizedSpecs = data.map(spec => {
      const total = spec.materialsList.reduce((sum, item) => {
        const material = materials.find(m => m._id.equals(item.materialId));
        return sum + (material ? material.price * item.quantity : 0);
      }, 0);
      
      return { ...spec, totalCost: Math.round(total) };
    });

    await Specification.insertMany(finalizedSpecs);

    console.log('--- РЕЗУЛЬТАТ СИДУВАННЯ ---');
    finalizedSpecs.forEach((s, i) => {
      console.log(`Специфікація №${i + 1}: Сформовано на суму ${s.totalCost.toLocaleString()} грн.`);
    });
    console.log('🚀 Специфікації успішно додані до бази!');

    process.exit();
  } catch (err) {
    console.error('❌ Помилка сидування:', err);
    process.exit(1);
  }
};

seedSpecs();