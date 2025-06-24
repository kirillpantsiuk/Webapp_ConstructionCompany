const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount:      { type: Number },
  paymentDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
