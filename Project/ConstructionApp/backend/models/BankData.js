const bankDataSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  IBAN: String,
  bankName: String,
  accountOwner: String,
  clientId: { type: String, ref: 'Client' },
});
module.exports = mongoose.model('BankData', bankDataSchema);
