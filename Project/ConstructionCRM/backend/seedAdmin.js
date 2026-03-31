const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedAdmin = async () => {
  try {
    await User.deleteOne({ email: 'admin@build.com' }); // Видаляємо старого, якщо був
    
    await User.create({
      login: 'superadmin',
      password: 'admin_password_2026',
      email: 'admin@build.com',
      role: 'SuperAdmin'
    });

    console.log('--- SuperAdmin СТВОРЕНО УСПІШНО ---');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();