const constructionReportSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  reportDate: Date,
  progressDetails: String,
  photos: [String],
  nextSteps: String,
  objectId: { type: String, ref: 'ConstructionObject' },
});
module.exports = mongoose.model('ConstructionReport', constructionReportSchema);
