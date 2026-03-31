const mongoose = require('mongoose');

const passportDataSchema = new mongoose.Schema({
  series: { type: String, required: true },
  number: { type: String, required: true },
  issueDate: { type: Date, required: true },
  issuedBy: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('PassportData', passportDataSchema);