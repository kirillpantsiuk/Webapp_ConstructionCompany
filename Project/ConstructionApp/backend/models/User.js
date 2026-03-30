const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  login: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Manager','TechnicalCoordinator','Worker','Admin'], 
    required: true 
  },
  email: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Active','Inactive','Pending'], 
    default: 'Active' 
  },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model('User', userSchema);
