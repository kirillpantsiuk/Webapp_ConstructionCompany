const CalendarPlan = require('../models/CalendarPlan'); // Імпорт БЕЗ фігурних дужок
const GanttChart = require('../models/GanttChart');

// --- Допоміжна функція для синхронізації з Гантом ---
const syncGanttData = async (plan) => {
  try {
    const ganttTasks = [];
    const ganttTimelines = {};

    plan.stages.forEach(stage => {
      stage.tasks.forEach(task => {
        // Ключі в Map не люблять крапки, замінюємо на дефіс
        const cleanStageName = stage.name.replace(/\./g, '-');
        const cleanTaskTitle = task.title.replace(/\./g, '-');
        const taskKey = `${cleanStageName}: ${cleanTaskTitle}`;
        
        ganttTasks.push(taskKey);
        
        // Форматуємо дати у рядок для моделі Ганта
        const start = task.startDate.toISOString().split('T')[0];
        const end = task.endDate.toISOString().split('T')[0];
        ganttTimelines[taskKey] = `${start} | ${end}`;
      });
    });

    await GanttChart.findOneAndUpdate(
      { planId: plan._id },
      { tasks: ganttTasks, timelines: ganttTimelines },
      { upsert: true, new: true }
    );
    console.log(`Gantt Chart synced for plan: ${plan._id}`);
  } catch (err) {
    console.error("Помилка синхронізації Ганта:", err);
  }
};

// --- Отримання всіх планів ---
exports.getCalendarPlans = async (req, res) => {
  try {
    // find() тепер працюватиме, бо імпорт коректний
    const plans = await CalendarPlan.find()
      .populate('objectId', 'address area')
      .populate('stages.tasks.assignedWorkers');
    res.status(200).json(plans);
  } catch (error) {
    console.error("GET Calendar Plans Error:", error);
    res.status(500).json({ message: "Помилка при отриманні планів" });
  }
};

// --- Створення нового плану (Математична модель) ---
exports.createCalendarPlan = async (req, res) => {
  try {
    const { objectId, material, isInternalToilet, stages } = req.body;

    // Створюємо документ на основі вашої оновленої схеми
    const newPlan = new CalendarPlan({
      objectId,
      material,         // Параметр m (brick/gasblock)
      isInternalToilet, // Параметр Xin
      stages            // Масив, де завдання вже мають volume та slack
    });

    const savedPlan = await newPlan.save();

    // Автоматично створюємо/оновлюємо дані для діаграми Ганта
    await syncGanttData(savedPlan);

    res.status(201).json(savedPlan);
  } catch (error) {
    console.error("POST Calendar Plan Error:", error);
    res.status(400).json({ message: "Помилка при збереженні плану", error: error.message });
  }
};

// --- Видалення плану ---
exports.deleteCalendarPlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Видаляємо сам план
    await CalendarPlan.findByIdAndDelete(id);
    
    // Видаляємо пов'язану діаграму Ганта
    await GanttChart.findOneAndDelete({ planId: id });

    res.status(200).json({ message: "План та діаграму Ганта видалено" });
  } catch (error) {
    res.status(500).json({ message: "Помилка при видаленні" });
  }
};