// models/TeamMember.js
const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('TeamMember', TeamMemberSchema);
