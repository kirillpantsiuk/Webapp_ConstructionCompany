const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  registrationDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);