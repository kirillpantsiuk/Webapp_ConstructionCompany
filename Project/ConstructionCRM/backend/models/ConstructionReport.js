const mongoose = require('mongoose');

const constructionReportSchema = new mongoose.Schema({
  reportNumber: { type: String, required: true, unique: true },
  objectId: { type: mongoose.Schema.Types.ObjectId, ref: 'BuildingObject', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'CalendarPlan', required: true },
  generatedBy: { type: String, required: true },
  content: { 
    stages: Array // Зберігаємо копію етапів та завдань на момент створення
  }
}, { timestamps: true });

module.exports = mongoose.Schema('ConstructionReport', constructionReportSchema);