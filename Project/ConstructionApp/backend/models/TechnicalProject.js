const mongoose = require("mongoose");

const TechnicalProjectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: { type: String },
  objectId: { type: String, ref: "ConstructionObject" },
  taskId: { type: String, ref: "TechnicalTask" }
});

module.exports = mongoose.model("TechnicalProject", TechnicalProjectSchema);
