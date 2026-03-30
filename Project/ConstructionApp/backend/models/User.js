const userSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  login: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['Manager','TechnicalCoordinator','Worker','Admin'] },
  email: String,
  active: { type: Boolean, default: true },
});
module.exports = mongoose.model('User', userSchema);
