const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const inspectionSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  inspectionDate: { type: Date },
  inspector: { type: String },
  results: { type: String },
  recommendations: { type: String },
  objectId: { type: String, required: true }
});

module.exports = mongoose.model('Inspection', inspectionSchema);
