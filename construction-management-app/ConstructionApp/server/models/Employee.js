const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  position: { type: String },
  salary:   { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
