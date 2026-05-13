const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  startDate: Date,
  endDate: Date,
  volume: { type: Number, default: 0 },
  slack: { type: Number, default: 0 },
  assignedWorkers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }]
});

const stageSchema = new mongoose.Schema({
  name: String,
  tasks: [taskSchema]
});

const CalendarPlanSchema = new mongoose.Schema({
  objectId: { type: mongoose.Schema.Types.ObjectId, ref: 'BuildingObject', required: true },
  material: { type: String, enum: ['brick', 'gasblock'], default: 'gasblock' },
  isInternalToilet: { type: Boolean, default: true },
  stages: [stageSchema],
}, { timestamps: true });

// ВАЖЛИВО: експорт має бути таким
module.exports = mongoose.model('CalendarPlan', CalendarPlanSchema);