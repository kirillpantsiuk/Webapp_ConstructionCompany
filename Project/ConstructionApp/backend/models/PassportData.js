const mongoose = require("mongoose");

const PassportDataSchema = new mongoose.Schema({
  id: { type: String, required: true },
  series: { type: String },
  number: { type: String },
  issueDate: { type: Date },
  issuedBy: { type: String },
  clientId: { type: String, ref: "Client" }
});

module.exports = mongoose.model("PassportData", PassportDataSchema);
