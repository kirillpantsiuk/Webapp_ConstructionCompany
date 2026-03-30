const calendarPlanSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  startDate: Date,
  endDate: Date,
  tasks: [String],
  objectId: { type: String, ref: 'ConstructionObject' },
});
module.exports = mongoose.model('CalendarPlan', calendarPlanSchema);
