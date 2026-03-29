const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }, // SuperAdmin, Manager, TechnicalCoordinator
  email: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true }
});

// Хешування пароля перед збереженням
userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Перевірка пароля
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
