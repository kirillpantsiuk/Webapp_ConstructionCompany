const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  projectId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name:        { type: String, required: true },
  description: { type: String },
  startDate:   { type: Date },
  endDate:     { type: Date },
  status:      { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
