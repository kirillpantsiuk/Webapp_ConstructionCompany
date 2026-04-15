const mongoose = require('mongoose');

const projectSupplySchema = new mongoose.Schema({
  // Зв'язок з об'єктом будівництва
  objectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BuildingObject', 
    required: true 
  },
  // Зв'язок з техпланом (додаємо це поле!)
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TechnicalProject'
  },
  // Список усіх елементів
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'шт' },
    type: { type: String } // Основний, Додатковий, Інструмент
  }],
  status: { 
    type: String, 
    default: 'Затверджено' 
  }
}, { timestamps: true });

module.exports = mongoose.model('ProjectSupply', projectSupplySchema);