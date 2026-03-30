const siteInspectionSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  inspectionDate: Date,
  inspector: String,
  results: String,
  recommendations: String,
  objectId: { type: String, ref: 'ConstructionObject' },
});
module.exports = mongoose.model('SiteInspection', siteInspectionSchema);
