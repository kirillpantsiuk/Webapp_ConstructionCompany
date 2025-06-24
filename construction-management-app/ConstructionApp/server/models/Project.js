const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  startDate:   { type: Date },
  endDate:     { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
