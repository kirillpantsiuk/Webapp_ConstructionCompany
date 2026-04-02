const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 

const seedAdmin = async () => {
  try {
    // 1. Очищуємо старих адмінів
    await User.deleteMany({ role: 'SuperAdmin' });

    // 2. ХЕШУЄМО ПАРОЛЬ ВРУЧНУ ДЛЯ SEED-СКРИПТА
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin_password_2026', salt);

    // 3. Створюємо адміна вже з ХЕШЕМ
    await User.create({
      login: 'superadmin',
      email: 'admin@build.com',
      password: hashedPassword, // Записуємо хеш
      role: 'SuperAdmin',
      phone: '+380000000000',
      department: 'Головний офіс',
      specialization: 'Адміністрування систем',
      experience: 10
    });

    console.log('✅ SuperAdmin перезаписаний із захешованим паролем!');
    process.exit();
  } catch (error) {
    console.error('❌ Помилка:', error);
    process.exit(1);
  }
};