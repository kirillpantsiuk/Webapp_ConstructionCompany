const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  // Розділений ПІБ
  surname: { 
    type: String, 
    required: [true, 'Прізвище є обов’язковим'], 
    trim: true 
  },
  firstName: { 
    type: String, 
    required: [true, 'Ім’я є обов’язковим'], 
    trim: true 
  },
  patronymic: { 
    type: String, 
    required: [true, 'По батькові є обов’язковим'], 
    trim: true 
  },
  
  // Контактні дані
  phone: { 
    type: String, 
    required: [true, 'Номер телефону є обов’язковим'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email є обов’язковим'], 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  
  registrationDate: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true // Автоматично додає createdAt та updatedAt
});

// Віртуальне поле для отримання повного імені одним рядком (опціонально)
clientSchema.virtual('fullName').get(function() {
  return `${this.surname} ${this.firstName} ${this.patronymic}`;
});

module.exports = mongoose.model('Client', clientSchema);