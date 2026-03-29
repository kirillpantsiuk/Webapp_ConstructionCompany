const mongoose = require("mongoose");

const TechnicalTaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String },
  requirements: { type: String },
  createdAt: { type: Date, default: Date.now },
  objectId: { type: String, ref: "ConstructionObject" }
});

module.exports = mongoose.model("TechnicalTask", TechnicalTaskSchema);
