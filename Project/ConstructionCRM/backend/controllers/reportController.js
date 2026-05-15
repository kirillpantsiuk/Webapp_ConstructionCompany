const ConstructionReport = require('../models/ConstructionReport');
const CalendarPlan = require('../models/CalendarPlan');
const Payment = require('../models/Payment'); // 1. ПІДКЛЮЧАЄМО МОДЕЛЬ ПЛАТЕЖІВ

// @desc    Отримати всі звіти (Бачать і Менеджер, і Координатор)
const getReports = async (req, res) => {
  try {
    const reports = await ConstructionReport.find()
      .populate('objectId', 'address clientId') // Додаємо clientId для перевірок
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Помилка завантаження архіву' });
  }
};

// @desc    Створити звіт (Тільки Технічний координатор)
const createReport = async (req, res) => {
  try {
    const { objectId, planId, stages, generatedBy } = req.body;
    const newReport = new ConstructionReport({
      reportNumber: `REP-${Date.now()}`,
      objectId,
      planId,
      generatedBy: generatedBy || req.user.lastName,
      content: { stages }
    });
    const savedReport = await newReport.save();
    await CalendarPlan.findByIdAndUpdate(planId, { status: 'Reported' });
    
    const populated = await ConstructionReport.findById(savedReport._id).populate('objectId', 'address');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Помилка створення звіту' });
  }
};

// @desc    Оновити статус етапів ТА синхронізувати з моделлю Payment
const updateReportStatus = async (req, res) => {
  try {
    const { content, syncPayments } = req.body;
    
    // 2. ВАЖЛИВО: populate('objectId') дає нам доступ до clientId замовника
    const report = await ConstructionReport.findById(req.params.id).populate('objectId');
    
    if (!report) return res.status(404).json({ message: 'Звіт не знайдено' });

    // 3. Оновлюємо основний контент звіту
    report.content = content || report.content;
    const updatedReport = await report.save();

    // 4. ЛОГІКА АВТОМАТИЧНОГО СТВОРЕННЯ ПЛАТЕЖІВ
    if (syncPayments && report.content.stages) {
      for (const stage of report.content.stages) {
        
        // Якщо менеджер поставив статус "Сплачено"
        if (stage.paymentStatus === 'Сплачено') {
          
          // Перевіряємо, чи не створювали ми вже платіж за цей конкретний етап раніше
          // (шукаємо за назвою етапу в нотатках, щоб не дублювати гроші при кожному натисканні "Зберегти")
          const existingPayment = await Payment.findOne({
            objectId: report.objectId._id,
            note: { $regex: stage.name, $options: 'i' }
          });

          if (!existingPayment) {
            // Перевірка, чи є у об'єкта замовник (clientId обов'язковий у схемі Payment)
            const targetClientId = report.objectId.clientId;

            if (targetClientId) {
              await Payment.create({
                amount: 0, // Як ти і просив - без суми
                status: 'Completed',
                paymentDate: new Date(),
                accountNumber: report.reportNumber, // Посилання на номер звіту
                clientId: targetClientId,
                objectId: report.objectId._id,
                note: `Оплата за етап: ${stage.name} (Авто-фіксація)`
              });
              console.log(`✅ Створено запис у Payment для етапу: ${stage.name}`);
            } else {
              console.warn(`⚠️ Пропущено: У об'єкта ${report.objectId.address} немає clientId`);
            }
          }
        }
      }
    }
    
    const populated = await ConstructionReport.findById(updatedReport._id).populate('objectId', 'address');
    res.json(populated);
  } catch (error) {
    console.error('Payment Sync Error:', error);
    res.status(500).json({ message: 'Помилка оновлення статусу та синхронізації фінансів' });
  }
};

// @desc    Видалити звіт (Тільки Координатор)
const deleteReport = async (req, res) => {
  try {
    const report = await ConstructionReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Звіт не знайдено' });
    await report.deleteOne();
    res.json({ message: 'Звіт видалено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка видалення' });
  }
};

module.exports = { getReports, createReport, updateReportStatus, deleteReport };