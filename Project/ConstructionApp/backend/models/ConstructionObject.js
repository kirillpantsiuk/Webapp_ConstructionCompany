const constructionObjectSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  address: String,
  coordinates: String,
  area: Number,
  description: String,
  clientId: { type: String, ref: 'Client' },
});
module.exports = mongoose.model('ConstructionObject', constructionObjectSchema);
