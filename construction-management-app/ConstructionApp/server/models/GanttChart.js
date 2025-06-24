const mongoose = require('mongoose');

const ganttTaskSchema = new mongoose.Schema({
  taskId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  startDate:    { type: Date },
  endDate:      { type: Date },
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
}, { _id: false });

const ganttChartSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  tasks:     [ganttTaskSchema]
}, { timestamps: true });

module.exports = mongoose.model('GanttChart', ganttChartSchema);
