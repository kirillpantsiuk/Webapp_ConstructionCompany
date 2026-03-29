const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const technicalTaskSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  description: { type: String },
  requirements: { type: String },
  createdAt: { type: Date, default: Date.now },
  objectId: { type: String, required: true }
});

module.exports = mongoose.model('TechnicalTask', technicalTaskSchema);
