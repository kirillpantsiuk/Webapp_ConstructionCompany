const mongoose = require('mongoose');
const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, default: 'шт' },
  price: { type: Number, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Tool', toolSchema);