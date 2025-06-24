const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  contactInfo:   { type: String },
  specialization:{ type: String },
  rating:        { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
