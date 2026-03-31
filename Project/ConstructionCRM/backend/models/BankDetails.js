const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  iban: { type: String, required: true },
  bankName: { type: String, required: true },
  accountOwner: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('BankDetails', bankDetailsSchema);