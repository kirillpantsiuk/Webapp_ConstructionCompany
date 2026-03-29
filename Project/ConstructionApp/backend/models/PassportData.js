const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const passportDataSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  series: { type: String, required: true },
  number: { type: String, required: true },
  issueDate: { type: Date },
  issuedBy: { type: String },
  clientId: { type: String, required: true }
});

module.exports = mongoose.model('PassportData', passportDataSchema);
