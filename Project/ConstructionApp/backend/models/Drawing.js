const drawingSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  file: String,
  uploadDate: { type: Date, default: Date.now },
  version: String,
  projectId: { type: String, ref: 'TechnicalProject' },
});
module.exports = mongoose.model('Drawing', drawingSchema);
