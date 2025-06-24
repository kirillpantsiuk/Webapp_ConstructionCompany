const mongoose = require('mongoose');

const criterionSchema = new mongoose.Schema({
  name:   { type: String },
  weight: { type: Number }
}, { _id: false });

const multiCriteriaAnalysisSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  analysisType: {
    type: String,
    enum: ['employee', 'supplier'],
    required: true
  },
  criteria: [criterionSchema],
  scores:   [{ type: Number }]
}, { timestamps: true });

module.exports = mongoose.model('MultiCriteriaAnalysis', multiCriteriaAnalysisSchema);
