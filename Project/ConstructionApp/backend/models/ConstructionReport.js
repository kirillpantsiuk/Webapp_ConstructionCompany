const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const constructionReportSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  reportDate: { type: Date, default: Date.now },
  progressDetails: { type: String },
  photos: { type: [String] },
  nextSteps: { type: String },
  objectId: { type: String, required: true }
});

module.exports = mongoose.model('ConstructionReport', constructionReportSchema);
