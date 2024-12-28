const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('profileId');
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
