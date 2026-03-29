const mongoose = require("mongoose");

const ManagerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  department: { type: String },
  phone: { type: String }
});

module.exports = mongoose.model("Manager", ManagerSchema);
