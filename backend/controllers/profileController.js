const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    // Attach both user id and role to request for downstream permission checks
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Export auth middleware so routes can use it
exports.authMiddleware = authMiddleware;

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ name: user.name, email: user.email });
};

exports.updateProfile = async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (name) user.name = name;
  if (password) user.password = await bcrypt.hash(password, 10);
  await user.save();
  res.json({ message: 'Profile updated' });
};