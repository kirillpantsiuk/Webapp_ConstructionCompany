const technicalProjectSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  name: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  status: String,
  objectId: { type: String, ref: 'ConstructionObject' },
  taskId: { type: String, ref: 'TechnicalTask' },
});
module.exports = mongoose.model('TechnicalProject', technicalProjectSchema);
