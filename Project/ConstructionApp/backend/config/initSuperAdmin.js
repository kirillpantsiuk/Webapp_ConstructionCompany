const SuperAdmin = require('../models/SuperAdmin');

const initSuperAdmin = async () => {
  try {
    const existingAdmin = await SuperAdmin.findOne({ email: 'superadmin@example.com' });
    if (!existingAdmin) {
      const superAdmin = new SuperAdmin({
        email: 'superadmin@example.com',
        password: 'SuperStrongPassword123', // буде захешовано автоматично
      });
      await superAdmin.save();
      console.log('✅ Super Admin created automatically');
    } else {
      console.log('ℹ️ Super Admin already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing Super Admin:', error);
  }
};

module.exports = initSuperAdmin;
