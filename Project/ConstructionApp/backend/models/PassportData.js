const passportDataSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  series: String,
  number: String,
  issueDate: Date,
  issuedBy: String,
  clientId: { type: String, ref: 'Client' },
});
module.exports = mongoose.model('PassportData', passportDataSchema);
