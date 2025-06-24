const mongoose = require('mongoose');

const materialOrderSchema = new mongoose.Schema({
  materialId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
  supplierId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  quantity:     { type: Number },
  unitPrice:    { type: Number },
  totalCost:    { type: Number },
  orderDate:    { type: Date },
  deliveryDate: { type: Date },
  status:       { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MaterialOrder', materialOrderSchema);
