const mongoose = require('mongoose');

const constructionReportSchema = new mongoose.Schema({
  reportDate: { type: Date, default: Date.now },
  progressDetails: { type: String, required: true },
  photos: [{ type: String }],
  nextSteps: { type: String },
  objectId: { type: mongoose.Schema.Types.ObjectId, ref: 'BuildingObject', required: true }
}, { timestamps: true });

module.exports = mongoose.model('ConstructionReport', constructionReportSchema);