const specificationSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  materialsList: { type: Map, of: String },
  quantities: { type: Map, of: Number },
  totalCost: Number,
  projectId: { type: String, ref: 'TechnicalProject' },
});
module.exports = mongoose.model('Specification', specificationSchema);
