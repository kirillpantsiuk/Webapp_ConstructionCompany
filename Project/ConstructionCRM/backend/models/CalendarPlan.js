const mongoose = require('mongoose');

const calendarPlanSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  tasks: [{ type: String }],
  objectId: { type: mongoose.Schema.Types.ObjectId, ref: 'BuildingObject', required: true, unique: true },
  assignedWorkers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }]
}, { timestamps: true });

module.exports = mongoose.model('CalendarPlan', calendarPlanSchema);