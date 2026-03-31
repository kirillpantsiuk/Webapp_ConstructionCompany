const mongoose = require('mongoose');

const siteInspectionSchema = new mongoose.Schema({
  inspectionDate: { type: Date, default: Date.now },
  inspector: { type: String, required: true },
  results: { type: String, required: true },
  recommendations: { type: String },
  objectId: { type: mongoose.Schema.Types.ObjectId, ref: 'BuildingObject', required: true }
}, { timestamps: true });

module.exports = mongoose.model('SiteInspection', siteInspectionSchema);