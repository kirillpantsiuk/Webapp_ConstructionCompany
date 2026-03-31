const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  materialsList: [{
    materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
    quantity: { type: Number, required: true }
  }],
  totalCost: { type: Number, default: 0 },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'TechnicalProject', required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Specification', specificationSchema);