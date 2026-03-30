const workerSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  firstName: String,
  lastName: String,
  specialization: String,
  available: { type: Boolean, default: true },
  contacts: String,
});
module.exports = mongoose.model('Worker', workerSchema);
