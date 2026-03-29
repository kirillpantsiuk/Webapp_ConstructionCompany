const mongoose = require("mongoose");

const DrawingSchema = new mongoose.Schema({
  id: { type: String, required: true },
  file: { type: String },
  uploadDate: { type: Date, default: Date.now },
  version: { type: String },
  projectId: { type: String, ref: "TechnicalProject" }
});

module.exports = mongoose.model("Drawing", DrawingSchema);
