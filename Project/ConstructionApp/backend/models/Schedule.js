const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const scheduleSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  startDate: { type: Date },
  endDate: { type: Date },
  tasks: { type: [String] },
  objectId: { type: String, required: true }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
