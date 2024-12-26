// controllers/userController.js
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

const createUser = async (req, res) => {
  const { username, password, role, name, email, phone, address } = req.body;
  try {
    const user = new User({ username, password, role });
    await user.save();

    const profile = new UserProfile({ userId: user._id, name, email, phone, address });
    await profile.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'User creation failed' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('profileId');
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch users' });
  }
};

const updateUser = async (req, res) => {
  const { username, password, role, name, email, phone, address } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (username) user.username = username;
    if (password) user.password = password;
    if (role) user.role = role;
    await user.save();

    const profile = await UserProfile.findById(user.profileId);
    if (name) profile.name = name;
    if (email) profile.email = email;
    if (phone) profile.phone = phone;
    if (address) profile.address = address;
    await profile.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'User update failed' });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await UserProfile.findOneAndDelete({ userId: req.params.id });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'User deletion failed' });
  }
};

module.exports = { createUser, getUsers, updateUser, deleteUser };
