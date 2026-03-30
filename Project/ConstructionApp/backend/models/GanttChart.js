const ganttChartSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  tasks: [String],
  timelines: { type: Map, of: String },
  scheduleId: { type: String, ref: 'CalendarPlan' },
});
module.exports = mongoose.model('GanttChart', ganttChartSchema);
