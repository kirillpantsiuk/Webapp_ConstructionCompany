const mongoose = require('mongoose');

const blueprintSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true }, 
  uploadDate: { type: Date, default: Date.now },
  version: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'TechnicalProject', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Blueprint', blueprintSchema);