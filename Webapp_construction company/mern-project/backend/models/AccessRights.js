// models/AccessRights.js
const mongoose = require('mongoose');

const AccessRightsSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['Builder', 'Foreman', 'ProjectManager', 'Customer', 'Director'],
    required: true,
  },
  permissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission',
    required: true,
  },
});

module.exports = mongoose.model('AccessRights', AccessRightsSchema);
