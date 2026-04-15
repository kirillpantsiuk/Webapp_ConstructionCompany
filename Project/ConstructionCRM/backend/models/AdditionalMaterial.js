const mongoose = require('mongoose');
const additionalMaterialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  stage: { type: Number, required: true }
}, { timestamps: true });
module.exports = mongoose.model('AdditionalMaterial', additionalMaterialSchema);