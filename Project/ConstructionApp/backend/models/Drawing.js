const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const drawingSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  file: { type: String },
  uploadDate: { type: Date, default: Date.now },
  version: { type: String },
  projectId: { type: String, required: true }
});

module.exports = mongoose.model('Drawing', drawingSchema);
