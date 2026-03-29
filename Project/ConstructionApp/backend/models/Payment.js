const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const paymentSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  status: { type: String },
  accountNumber: { type: String },
  clientId: { type: String, required: true },
  objectId: { type: String, required: true }
});

module.exports = mongoose.model('Payment', paymentSchema);
