const mongoose = require("mongoose");

const TechnicalCoordinatorSchema = new mongoose.Schema({
  id: { type: String, required: true },
  specialization: { type: String },
  experience: { type: Number }
});

module.exports = mongoose.model("TechnicalCoordinator", TechnicalCoordinatorSchema);
