// controllers/teamController.js
const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');
const User = require('../models/User');

const createTeam = async (req, res) => {
  const { name, members } = req.body;
  try {
    const team = new Team({ name });
    await team.save();

    for (const memberId of members) {
      const teamMember = new TeamMember({ teamId: team._id, userId: memberId });
      await teamMember.save();
    }

    res.status(201).json({ message: 'Team created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Team creation failed' });
  }
};

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate({
      path: 'members',
      populate: {
        path: 'userId',
        model: 'User',
      },
    });
    res.status(200).json(teams);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch teams' });
  }
};

const updateTeam = async (req, res) => {
  const { name, members } = req.body;
  try {
    const team = await Team.findById(req.params.id);
    if (name) team.name = name;
    await team.save();

    await TeamMember.deleteMany({ teamId: team._id });
    for (const memberId of members) {
      const teamMember = new TeamMember({ teamId: team._id, userId: memberId });
      await teamMember.save();
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(400).json({ message: 'Team update failed' });
  }
};

const deleteTeam = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    await TeamMember.deleteMany({ teamId: req.params.id });
    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Team deletion failed' });
  }
};

module.exports = { createTeam, getTeams, updateTeam, deleteTeam };
