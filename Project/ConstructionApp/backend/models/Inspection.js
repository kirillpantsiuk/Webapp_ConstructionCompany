const mongoose = require("mongoose");

const InspectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  inspectionDate: { type: Date },
  inspector: { type: String },
  results: { type: String },
  recommendations: { type: String },
  objectId: { type: String, ref: "ConstructionObject" }
});

module.exports = mongoose.model("Inspection", InspectionSchema);
