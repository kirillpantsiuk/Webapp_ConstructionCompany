const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String },
  description: { type: String },
  unit: { type: String },
  price: { type: Number },
  availableQuantity: { type: Number }
});

module.exports = mongoose.model("Material", MaterialSchema);
