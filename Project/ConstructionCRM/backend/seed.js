const mongoose = require('mongoose');
const Blueprint = require('./models/Blueprint'); // Ваш шлях до моделі

// ⚠️ ЗАМІНІТЬ НА ВАШ РЕАЛЬНИЙ URL ПІДКЛЮЧЕННЯ ДО MONGODB!
const MONGO_URI = 'mongodb://127.0.0.1:27017/construction_db'; 

const blueprintsData = [
  { name: 'B-1 Bachelor', imageUrl: '/uploads/b1_bachelor.png' },
  { name: 'E-1 Energo Smart', imageUrl: '/uploads/e1_energo_smart.png' },
  { name: 'E-2 Autonom Optima', imageUrl: '/uploads/e2_autonom_optima.png' },
  { name: 'G-1 Trio Balance', imageUrl: '/uploads/g1_trio_balance.png' },
  { name: 'G-2 Master Trio', imageUrl: '/uploads/g2_master_trio.png' },
  { name: 'G-3 Techno Pro', imageUrl: '/uploads/g3_techno_pro.png' },
  { name: 'G-4 Family Estate', imageUrl: '/uploads/g4_family_estate.png' },
  { name: 'G-5 Universal', imageUrl: '/uploads/g5_universal.png' },
  { name: 'H-1 Holiday', imageUrl: '/uploads/h1_holiday.png' },
  { name: 'L-1 Premium Solo', imageUrl: '/uploads/l1_premium_solo.png' },
  { name: 'M-1 Classic Duo', imageUrl: '/uploads/m1_classic_duo.png' },
  { name: 'M-3 Engineering Vector', imageUrl: '/uploads/m3_engineering_vector.png' },
  { name: 'M-4 Comfort House', imageUrl: '/uploads/m4_comfort_house.png' },
  { name: 'M-5 Service Plus', imageUrl: '/uploads/m5_service_plus.png' },
  { name: 'S-1 Smart Basis', imageUrl: '/uploads/s1_smart_basis.png' },
  { name: 'S-2 Smart Optima', imageUrl: '/uploads/s2_smart_optima.png' },
  { name: 'T-1 Techno Mini', imageUrl: '/uploads/t1_techno_mini.png' },
  { name: 'W-1 Work-House', imageUrl: '/uploads/w1_work_house.png' },
  { name: 'W-2 Aqua Pure', imageUrl: '/uploads/w2_aqua_pure.png' },
  { name: 'Family Standard', imageUrl: '/uploads/family_standard.png' }
];
const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Підключено до MongoDB...');

    // Очищаємо колекцію перед наповненням, щоб не було дублікатів
    await Blueprint.deleteMany({});
    console.log('🧹 Старі записи видалено.');

    // Масово вставляємо всі дані
    await Blueprint.insertMany(blueprintsData);
    console.log('🚀 20 креслень успішно додано до бази!');

    process.exit();
  } catch (error) {
    console.error('❌ Помилка:', error);
    process.exit(1);
  }
};

seedDB();