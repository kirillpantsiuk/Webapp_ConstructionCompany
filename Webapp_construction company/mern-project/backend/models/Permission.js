// models/Permission.js
const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  permission: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Permission', PermissionSchema);
