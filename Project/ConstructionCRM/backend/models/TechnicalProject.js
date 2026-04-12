const mongoose = require('mongoose');

const technicalProjectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  status: { 
    type: String, 
    default: 'Active' 
  },
  objectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BuildingObject', 
    required: true, 
    unique: true 
  },
  // Змінюємо ref на 'Blueprint', щоб працювала роздруківка з картинкою
  taskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Blueprint', 
    required: true 
  },
  // Додаємо поле для збереження кроків Майстра та матеріалів
  fullPlanData: { 
    type: Object 
  }
}, { timestamps: true });

module.exports = mongoose.model('TechnicalProject', technicalProjectSchema);