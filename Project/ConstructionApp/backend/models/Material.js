const materialSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  name: String,
  description: String,
  unit: String,
  price: Number,
  availableQuantity: Number,
});
module.exports = mongoose.model('Material', materialSchema);
