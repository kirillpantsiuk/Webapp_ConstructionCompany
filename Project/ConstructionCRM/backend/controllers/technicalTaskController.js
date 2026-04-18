const TechnicalTask = require('../models/TechnicalTask');

// Функція збереження/оновлення календарного плану
exports.saveCalendarPlan = async (req, res) => {
  try {
    const { objectId } = req.params;
    const { calendarPlan, description, requirements } = req.body;

    // Шукаємо план за objectId. Якщо є - оновлюємо, якщо немає - створюємо (upsert: true)
    const updatedTask = await TechnicalTask.findOneAndUpdate(
      { objectId: objectId },
      { 
        $set: { 
          calendarPlan: calendarPlan,
          description: description || "Календарний план робіт", // Значення за замовчуванням
          requirements: requirements || "Згідно з нормами будівництва"
        } 
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    console.error("❌ Помилка при збереженні плану:", error.message);
    res.status(500).json({ success: false, message: 'Помилка сервера', error: error.message });
  }
};