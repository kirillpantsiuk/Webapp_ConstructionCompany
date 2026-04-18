const mongoose = require('mongoose');

// 1. Вкладена схема для окремої ЗАДАЧІ
const taskItemSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Назва: "Монтаж опалубки"
  startDate: { type: Date, default: null }, // Початок задачі
  endDate: { type: Date, default: null },   // Закінчення задачі
  assignedWorkers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Worker' // Зв'язок із таблицею робітників
  }],
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed'], 
    default: 'pending' 
  }
});

// 2. Вкладена схема для ЕТАПУ
const stageSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Назва: "КРОК 04. ФУНДАМЕНТ"
  tasks: [taskItemSchema]                 // Масив задач, що належать до цього етапу
});

// 3. ОСНОВНА СХЕМА ТЕХНІЧНОГО ЗАВДАННЯ
const technicalTaskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  
  // Блок для збереження Календарного плану (Ганта)
  calendarPlan: {
    stages: [stageSchema] // Масив усіх етапів з їхніми задачами
  },

  creationDate: { type: Date, default: Date.now },
  objectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BuildingObject', 
    required: true, 
    unique: true // Для одного об'єкта - один технічний план
  }
}, { timestamps: true });

module.exports = mongoose.model('TechnicalTask', technicalTaskSchema);