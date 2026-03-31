const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  login: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['Manager', 'TechnicalCoordinator', 'SuperAdmin'], 
    required: true 
  },
  
  // Поля для менеджера
  phone: { 
    type: String, 
    default: '' 
  },
  department: { 
    type: String, 
    default: '' 
  },
  
  // Поля для технічного координатора
  specialization: { 
    type: String, 
    default: '' 
  },
  experience: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

/**
 * Шифрування пароля перед збереженням.
 * Використовуємо async функцію без next(), 
 * щоб уникнути конфліктів у нових версіях Mongoose.
 */
userSchema.pre('save', async function() {
  // Якщо пароль не змінювався (наприклад, при оновленні профілю без зміни пароля) - йдемо далі
  if (!this.isModified('password')) {
    return;
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    // Викидаємо помилку, Mongoose її перехопить
    throw error;
  }
});

/**
 * Метод для перевірки пароля при вході
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);