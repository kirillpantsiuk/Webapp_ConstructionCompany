const mongoose = require("mongoose");

const GanttChartSchema = new mongoose.Schema({
  id: { type: String, required: true },
  tasks: [{ type: String }],
  timelines: { type: Map, of: String },
  scheduleId: { type: String, ref: "Schedule" }
});

module.exports = mongoose.model("GanttChart", GanttChartSchema);
