const mongoose = require('mongoose');

const abcAnalysisSchema = new mongoose.Schema({
  materialId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Material', 
    required: true 
  },
  category:   { type: String, required: true }  // A, B или C
}, { timestamps: true });

module.exports = mongoose.model('ABCAnalysis', abcAnalysisSchema);
