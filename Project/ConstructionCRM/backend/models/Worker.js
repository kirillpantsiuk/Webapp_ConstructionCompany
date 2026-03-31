const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
firstName: { type: String, required: true },
lastName: { type: String, required: true },
specialization: { type: String, required: true },
isAvailable: { type: Boolean, default: true },
contacts: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);