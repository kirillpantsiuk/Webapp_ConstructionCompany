const mongoose = require('mongoose');

const ganttChartSchema = new mongoose.Schema({
  tasks: [{ type: String }],
  timelines: { type: Map, of: String },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'CalendarPlan', required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('GanttChart', ganttChartSchema);