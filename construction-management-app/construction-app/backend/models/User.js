const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['builder', 'foreman', 'project_manager', 'client', 'director', 'accountant'],
    required: true
  },
  email: { type: String, required: true, unique: true },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
