const User = require('./models/User'); // шлях до вашої моделі
// ... інша логіка підключення до БД ...

const seedAdmin = async () => {
  try {
    await User.deleteMany({ role: 'SuperAdmin' }); // Видаляємо старих адмінів

    const admin = await User.create({
      login: 'superadmin',
      email: 'admin@build.com',
      password: 'admin_password_2026',
      role: 'SuperAdmin',
      phone: '+380000000000', // Додаємо дефолтний телефон
      department: 'Головний офіс',
      specialization: 'Адміністрування систем',
      experience: 10
    });

    console.log('SuperAdmin перезаписаний успішно!');
    process.exit();
  } catch (error) {
    console.error('Помилка:', error);
    process.exit(1);
  }
};