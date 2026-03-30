const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');

const protectSuperAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const superAdmin = await SuperAdmin.findById(decoded.id);
      if (!superAdmin || superAdmin.role !== 'SuperAdmin') {
        return res.status(403).json({ message: '❌ Access denied' });
      }

      req.superAdmin = superAdmin;
      next();
    } catch (error) {
      return res.status(401).json({ message: '❌ Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: '❌ No token provided' });
  }
};

module.exports = { protectSuperAdmin };
