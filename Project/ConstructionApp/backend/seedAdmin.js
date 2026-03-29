const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

connectDB();

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ login: 'superadmin' });
    if (adminExists) {
      console.log('Super Admin already exists');
      process.exit();
    }

    const admin = new User({
      login: 'superadmin',
      password: 'SuperSecret123',
      role: 'SuperAdmin',
      email: 'admin@example.com'
    });
    await admin.save();
    console.log('✅ Super Admin created');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
