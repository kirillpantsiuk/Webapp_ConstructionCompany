const mongoose = require('mongoose');

const technicalCoordinatorSchema = new mongoose.Schema({
  specialization: { type: String },
  experience: { type: Number }
}, { discriminatorKey: 'role' });

module.exports = mongoose.model('TechnicalCoordinator', technicalCoordinatorSchema);
