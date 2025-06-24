const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  start: { type: Date },
  end:   { type: Date }
}, { _id: false });

const workSlotSchema = new mongoose.Schema({
  taskId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  teamId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  startTime: { type: Date },
  endTime:   { type: Date },
  duration:  { type: Number },
  status:    { 
    type: String,
    enum: ["planned", "in_progress", "completed", "canceled"]
  }
}, { _id: false });

const scheduleSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name:      { type: String },
  period:    { type: periodSchema },
  workSlots: [workSlotSchema]
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
