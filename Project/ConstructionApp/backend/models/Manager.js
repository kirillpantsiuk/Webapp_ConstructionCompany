const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  department: { type: String },
  phone: { type: String }
}, { discriminatorKey: 'role' });

module.exports = mongoose.model('Manager', managerSchema);
