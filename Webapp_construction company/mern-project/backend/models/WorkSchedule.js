// models/WorkSchedule.js
const mongoose = require('mongoose');

const WorkScheduleSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
});

module.exports = mongoose.model('WorkSchedule', WorkScheduleSchema);
