const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  tasks: [{ type: String }],
  objectId: { type: String, ref: "ConstructionObject" }
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
