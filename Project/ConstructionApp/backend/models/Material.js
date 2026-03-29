const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const materialSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  description: { type: String },
  unit: { type: String },
  price: { type: Number },
  availableQuantity: { type: Number }
});

module.exports = mongoose.model('Material', materialSchema);
