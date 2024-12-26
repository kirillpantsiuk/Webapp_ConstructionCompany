// controllers/workScheduleController.js
const WorkSchedule = require('../models/WorkSchedule');

const getWorkSchedules = async (req, res) => {
  try {
    const workSchedules = await WorkSchedule.find().populate({
      path: 'tasks',
      populate: {
        path: 'assignedTo',
        model: 'User',
      },
    });
    res.status(200).json(workSchedules);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch work schedules' });
  }
};

module.exports = { getWorkSchedules };
