const mongoose = require('mongoose');

const technicalTaskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  objectId: { type: mongoose.Schema.Types.ObjectId, ref: 'BuildingObject', required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('TechnicalTask', technicalTaskSchema);