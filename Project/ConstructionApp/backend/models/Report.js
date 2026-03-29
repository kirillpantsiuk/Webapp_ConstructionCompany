const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  id: { type: String, required: true },
  reportDate: { type: Date },
  progressDetails: { type: String },
  photos: [{ type: String }],
  nextSteps: { type: String },
  objectId: { type: String, ref: "ConstructionObject" }
});

module.exports = mongoose.model("Report", ReportSchema);
