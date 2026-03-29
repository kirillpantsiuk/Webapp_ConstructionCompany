const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bankDataSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  IBAN: { type: String, required: true },
  bankName: { type: String },
  accountOwner: { type: String },
  clientId: { type: String, required: true }
});

module.exports = mongoose.model('BankData', bankDataSchema);
