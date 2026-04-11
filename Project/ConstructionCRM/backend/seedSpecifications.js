const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Material = require('./models/Material');
const Specification = require('./models/Specification');

dotenv.config();

const seedSpecs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Підключено для генерації пакетних специфікацій');

    const materials = await Material.find();
    if (materials.length === 0) {
      console.log('❌ База матеріалів порожня! Спочатку запустіть node seedMaterials.js');
      process.exit(1);
    }

    const getMatId = (name) => materials.find(m => m.name.toLowerCase().includes(name.toLowerCase()))?._id;

    await Specification.deleteMany({});

    const specsData = [
      {
        name: "Специфікація: Базовий Фундамент",
        materialsList: [
          { materialId: getMatId('Бетон М300'), quantity: 50 },
          { materialId: getMatId('Арматура сталева 12'), quantity: 1.5 },
          { materialId: getMatId('Пісок річковий'), quantity: 30 },
          { materialId: getMatId('Мастика бітумна'), quantity: 4 }
        ]
      },
      {
        name: "Специфікація: Стіни та Крівля (Стандарт)",
        materialsList: [
          { materialId: getMatId('Газоблок D400'), quantity: 75 },
          { materialId: getMatId('Клей для газоблоку'), quantity: 100 },
          { materialId: getMatId('Металочерепиця'), quantity: 190 },
          { materialId: getMatId('Вікно металопластикове'), quantity: 8 }
        ]
      },
      {
        name: "Специфікація: Оздоблення (Квартирний тип)",
        materialsList: [
          { materialId: getMatId('Гіпсокартон Knauf'), quantity: 120 },
          { materialId: getMatId('Ламінат 33 клас'), quantity: 115 },
          { materialId: getMatId('Фарба інтер’єрна'), quantity: 6 },
          { materialId: getMatId('Двері міжкімнатні'), quantity: 5 }
        ]
      }
    ];

    const finalizedSpecs = specsData.map(spec => {
      const total = spec.materialsList.reduce((sum, item) => {
        const mat = materials.find(m => m._id.equals(item.materialId));
        return sum + (mat ? mat.price * item.quantity : 0);
      }, 0);
      
      return { 
        ...spec, 
        projectId: new mongoose.Types.ObjectId(), // Тимчасовий ID для тесту
        totalCost: Math.round(total) 
      };
    });

    await Specification.insertMany(finalizedSpecs);
    console.log('🚀 Специфікації успішно розбиті за етапами та додані до бази!');
    process.exit();
  } catch (err) {
    console.error('❌ Помилка сидування специфікацій:', err);
    process.exit(1);
  }
};

seedSpecs();