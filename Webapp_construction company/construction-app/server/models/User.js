const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Builder', 'Foreman', 'ProjectManager', 'Customer', 'Director'], required: true },
  profileId: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
});

module.exports = mongoose.model('User', UserSchema);
