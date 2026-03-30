const documentationSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  type: String,
  content: String,
  generatedAt: { type: Date, default: Date.now },
  objectId: { type: String, ref: 'ConstructionObject' },
  clientId: { type: String, ref: 'Client' },
});
module.exports = mongoose.model('Documentation', documentationSchema);
