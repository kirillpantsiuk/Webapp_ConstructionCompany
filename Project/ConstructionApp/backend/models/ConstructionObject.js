const mongoose = require("mongoose");

const ConstructionObjectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  address: { type: String },
  coordinates: { type: String },
  area: { type: Number },
  description: { type: String },
  clientId: { type: String, ref: "Client" }
});

module.exports = mongoose.model("ConstructionObject", ConstructionObjectSchema);
