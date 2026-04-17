const mongoose = require('mongoose');

const siteInspectionSchema = mongoose.Schema({
  // Зв'язок з об'єктом будівництва
  objectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BuildingObject', 
    required: [true, 'ID об’єкта є обов’язковим'] 
  },
  
  // 1. ГЕОЛОГІЯ ТА ГРУНТ
  soilType: { 
    type: String, 
    enum: ['Піщаний', 'Глинистий', 'Чорнозем', 'Кам’янистий'], // Синхронізовано з фронтендом
    default: 'Чорнозем'
  },
  groundwaterLevel: { 
    type: String, 
    enum: ['Низький (>3м)', 'Середній (1.5-3м)', 'Високий'], // Синхронізовано
    default: 'Низький (>3м)' 
  },
  relief: { 
    type: String,
    default: '' 
  },

  // 2. КОМУНІКАЦІЇ
  electricity: {
    status: { 
      type: String, 
      enum: ['Підключено', 'Поруч (стовп)', 'Відсутнє'], 
      default: 'Відсутнє' 
    },
    distance: { type: Number, default: 0 },
    phases: { 
      type: String, 
      enum: ['1-фаза', '3-фази', 'Невідомо'], 
      default: 'Невідомо' 
    }
  },
  water: {
    status: { 
      type: String, 
      enum: ['Централізоване', 'Свердловина', 'Відсутнє'], // Синхронізовано
      default: 'Відсутнє' 
    },
    depthExpected: { type: Number, default: 0 }
  },
  gas: {
    status: { 
      type: String, 
      enum: ['Є по вулиці', 'Відсутнє'], // Синхронізовано
      default: 'Відсутнє' 
    }
  },

  // 3. ЛОГІСТИКА ТА ДОСТУП
  accessRoads: { 
    type: String, 
    enum: ['Асфальтоване', 'Бетонні плити', 'Грунтові дороги'], // Синхронізовано
    default: 'Грунтові дороги'
  },
  truckAccess: { 
    type: Boolean, 
    default: true 
  },
  storageArea: { 
    type: String, 
    enum: ['Достатньо місця', 'Обмежений простір', 'Місце відсутнє'],
    default: 'Достатньо місця' 
  },

  // 4. ОТОЧЕННЯ ТА ОБМЕЖЕННЯ
  existingStructures: { 
    type: String,
    default: ''
  },
  neighborConstraints: { 
    type: String,
    default: ''
  },
  powerLines: { 
    type: Boolean, 
    default: false 
  },

  // 5. ПІДСУМКИ
  recommendations: { 
    type: String,
    default: ''
  },
  inspectionDate: { 
    type: Date, 
    default: Date.now 
  },
  inspectorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false // Вимкнено, щоб не ламати наявний фронтенд
  }
}, { 
  timestamps: true 
});

// Додаємо індекс для швидкого пошуку за об'єктом
siteInspectionSchema.index({ objectId: 1 });

module.exports = mongoose.model('SiteInspection', siteInspectionSchema);