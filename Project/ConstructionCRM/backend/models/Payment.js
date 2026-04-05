const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Робимо суму необов'язковою, щоб можна було просто фіксувати факт
  amount: { type: Number, default: 0 }, 
  paymentDate: { type: Date, default: Date.now },
  // Статус: 'Pending', 'Completed', 'Failed'
  status: { type: String, default: 'Pending' },
  // Номер рахунку або договору
  accountNumber: { type: String, required: true },
  // Зв'язки
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  objectId: { type: mongoose.Schema.Types.ObjectId, ref: 'BuildingObject', required: true },
  // Додаткове поле для нотаток
  note: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);