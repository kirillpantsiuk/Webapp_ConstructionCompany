const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' },
  accountNumber: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  objectId: { type: mongoose.Schema.Types.ObjectId, ref: 'BuildingObject', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);