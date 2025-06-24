const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  quantity: { type: Number },
  unit:     { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
