const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
name: { type: String, required: true },
description: { type: String },
unit: { type: String, required: true },
price: { type: Number, required: true },
availableQuantity: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);