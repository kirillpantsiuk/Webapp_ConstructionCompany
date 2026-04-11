const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  unit: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  availableQuantity: { 
    type: Number, 
    default: 0 
  },
  // Поле для фільтрації за етапами будівництва (4 - фундамент, 5 - коробка, 6 - оздоблення)
  stage: { 
    type: Number, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);