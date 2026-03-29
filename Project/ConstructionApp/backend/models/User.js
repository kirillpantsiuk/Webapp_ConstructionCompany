const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true },
  login: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String },
  email: { type: String },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model("User", UserSchema);
