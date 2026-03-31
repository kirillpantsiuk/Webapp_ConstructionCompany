const mongoose = require('mongoose');

const buildingObjectSchema = new mongoose.Schema({
  address: { type: String, required: true },
  coordinates: { type: String },
  area: { type: Number, required: true },
  description: { type: String },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }
}, { timestamps: true });

module.exports = mongoose.model('BuildingObject', buildingObjectSchema);