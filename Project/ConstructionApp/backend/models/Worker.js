const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  specialization: { type: String },
  available: { type: Boolean, default: true },
  contacts: { type: String }
});

module.exports = mongoose.model("Worker", WorkerSchema);
