const technicalTaskSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  description: String,
  requirements: String,
  createdAt: { type: Date, default: Date.now },
  objectId: { type: String, ref: 'ConstructionObject' },
});
module.exports = mongoose.model('TechnicalTask', technicalTaskSchema);
