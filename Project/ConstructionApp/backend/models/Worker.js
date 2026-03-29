const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const workerSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  firstName: { type: String, required: true },
  lastName: { type: String },
  specialization: { type: String },
  available: { type: Boolean, default: true },
  contacts: { type: String }
});

module.exports = mongoose.model('Worker', workerSchema);
