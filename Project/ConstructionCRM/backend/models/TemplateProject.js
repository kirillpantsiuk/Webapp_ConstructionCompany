const mongoose = require('mongoose');

const templateProjectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  }, // Назва (напр. S-1 "Смарт Базис")
  configuration: { 
    type: String, 
    required: true 
  }, // Склад блоків (кімнати, санвузли, техн. приміщення)
  estimatedArea: { 
    type: Number, 
    required: true 
  }, // Приблизна площа в м²
  rooms: { 
    type: Number, 
    required: true 
  }, // Кількість житлових кімнат
  bathrooms: { 
    type: Number, 
    required: true 
  }, // Кількість санвузлів
  techRooms: { 
    type: Number, 
    default: 0 
  } // Кількість технічних приміщень
}, { 
  timestamps: true 
});

module.exports = mongoose.model('TemplateProject', templateProjectSchema);