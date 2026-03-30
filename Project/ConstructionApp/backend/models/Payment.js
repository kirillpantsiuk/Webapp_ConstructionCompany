const paymentSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  amount: Number,
  paymentDate: Date,
  status: String,
  accountNumber: String,
  clientId: { type: String, ref: 'Client' },
  objectId: { type: String, ref: 'ConstructionObject' },
});
module.exports = mongoose.model('Payment', paymentSchema);
