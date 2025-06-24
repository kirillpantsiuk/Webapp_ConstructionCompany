const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street:     { type: String },
  city:       { type: String },
  state:      { type: String },
  postalCode: { type: String },
  country:    { type: String }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["builder", "foreman", "project_manager", "client", "director", "accountant"],
    required: true
  },
  email:   { type: String, required: true, unique: true },
  address: { type: addressSchema, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
