const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String },
  content: { type: String },
  generatedAt: { type: Date, default: Date.now },
  objectId: { type: String, ref: "ConstructionObject" },
  clientId: { type: String, ref: "Client" }
});

module.exports = mongoose.model("Document", DocumentSchema);
