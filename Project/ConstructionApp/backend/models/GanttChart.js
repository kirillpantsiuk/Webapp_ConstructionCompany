const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ganttChartSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  tasks: { type: [String] },
  timelines: { type: Map, of: String },
  scheduleId: { type: String, required: true }
});

module.exports = mongoose.model('GanttChart', ganttChartSchema);
