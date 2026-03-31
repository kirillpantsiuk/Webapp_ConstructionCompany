const mongoose = require('mongoose');

const documentationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  content: { type: String, required: true },
  generationDate: { type: Date, default: Date.now },
  objectId: { type: mongoose.Schema.Types.ObjectId, ref: 'BuildingObject', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Documentation', documentationSchema);