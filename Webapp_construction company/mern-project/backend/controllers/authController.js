const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { username, password, role, name, email, phone, address } = req.body;
  try {
    const user = new User({ username, password, role });
    await user.save();

    const userProfile = new UserProfile({
      userId: user._id,
      name,
      email,
      phone,
      address,
    });
    await userProfile.save();

    user.profileId = userProfile._id;
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Login failed' });
  }
};

module.exports = { registerUser, loginUser };
