const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  assignedWorkers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Worker' 
  }]
});

const stageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  tasks: [taskSchema]
});

const calendarPlanSchema = new mongoose.Schema({
  objectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BuildingObject', 
    required: true,
    unique: true 
  },
  stages: [stageSchema]
}, { timestamps: true });

module.exports = mongoose.model('CalendarPlan', calendarPlanSchema);