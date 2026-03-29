const mongoose = require("mongoose");

const BankDataSchema = new mongoose.Schema({
  id: { type: String, required: true },
  IBAN: { type: String },
  bankName: { type: String },
  accountOwner: { type: String },
  clientId: { type: String, ref: "Client" }
});

module.exports = mongoose.model("BankData", BankDataSchema);
