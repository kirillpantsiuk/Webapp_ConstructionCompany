const mongoose = require('mongoose');

const technicalProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  creationDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Draft' },
  objectId: { type: mongoose.Schema.Types.ObjectId, ref: 'BuildingObject', required: true, unique: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'TechnicalTask', required: true }
}, { timestamps: true });

module.exports = mongoose.model('TechnicalProject', technicalProjectSchema);