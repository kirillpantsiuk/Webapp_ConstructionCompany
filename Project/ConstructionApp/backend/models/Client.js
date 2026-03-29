const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  registrationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Client", ClientSchema);
