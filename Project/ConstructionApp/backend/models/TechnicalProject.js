const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const technicalProjectSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: { type: String },
  objectId: { type: String, required: true },
  taskId: { type: String, required: true }
});

module.exports = mongoose.model('TechnicalProject', technicalProjectSchema);
