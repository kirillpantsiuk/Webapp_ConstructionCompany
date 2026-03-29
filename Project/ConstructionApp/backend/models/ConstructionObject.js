const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const constructionObjectSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  address: { type: String, required: true },
  coordinates: { type: String },
  area: { type: Number },
  description: { type: String },
  clientId: { type: String, required: true }
});

module.exports = mongoose.model('ConstructionObject', constructionObjectSchema);
