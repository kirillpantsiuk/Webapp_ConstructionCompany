const mongoose = require('mongoose');

const salaryPaymentSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  amount:     { type: Number, required: true },
  period:     { type: Date,   required: true },
  paymentDate:{ type: Date,   default: Date.now },
  createdBy:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SalaryPayment', salaryPaymentSchema);
