const saveGanttData = async (plan) => {
  const ganttTasks = [];
  const ganttTimelines = {};

  plan.stages.forEach(stage => {
    stage.tasks.forEach(task => {
      // Формуємо назву: "Етап - Назва завдання"
      const taskKey = `${stage.name}: ${task.title}`.replace(/\./g, '-');
      ganttTasks.push(taskKey);
      
      // Формуємо рядок таймлайну: "YYYY-MM-DD | YYYY-MM-DD"
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
};