const mongoose = require("mongoose");

const SpecificationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  materialsList: { type: Map, of: String },
  quantities: { type: Map, of: Number },
  totalCost: { type: Number },
  projectId: { type: String, ref: "TechnicalProject" }
});

module.exports = mongoose.model("Specification", SpecificationSchema);
