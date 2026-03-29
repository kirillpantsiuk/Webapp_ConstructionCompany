const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const documentationSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  type: { type: String },
  content: { type: String },
  generatedAt: { type: Date, default: Date.now },
  objectId: { type: String, required: true },
  clientId: { type: String, required: true }
});

module.exports = mongoose.model('Documentation', documentationSchema);
