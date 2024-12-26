// models/WorkTask.js
const mongoose = require('mongoose');

const WorkTaskSchema = new mongoose.Schema({
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkSchedule',
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('WorkTask', WorkTaskSchema);
