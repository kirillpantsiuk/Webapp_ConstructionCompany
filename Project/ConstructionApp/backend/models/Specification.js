const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const specificationSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  materialsList: { type: Map, of: String },
  quantities: { type: Map, of: Number },
  totalCost: { type: Number },
  projectId: { type: String, required: true }
});

module.exports = mongoose.model('Specification', specificationSchema);
