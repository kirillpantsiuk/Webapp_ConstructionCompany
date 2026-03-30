const clientSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  name: String,
  phone: String,
  email: { type: String, unique: true },
  registrationDate: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Client', clientSchema);
