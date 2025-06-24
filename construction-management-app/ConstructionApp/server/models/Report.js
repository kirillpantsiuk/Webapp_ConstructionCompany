const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: function() { return this.type === 'project'; }
  },
  type: {
    type: String,
    enum: ['project', 'financial'],
    required: true
  },
  content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
