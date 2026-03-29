const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  amount: { type: Number },
  paymentDate: { type: Date },
  status: { type: String },
  accountNumber: { type: String },
  clientId: { type: String, ref: "Client" },
  objectId: { type: String, ref: "ConstructionObject" }
});

module.exports = mongoose.model("Payment", PaymentSchema);
