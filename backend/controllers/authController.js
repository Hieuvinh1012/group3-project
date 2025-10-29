const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Use environment variable for JWT secret and expiry to avoid hard-coded secrets
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'Email already exists' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: 'User created' });
};


 
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: JWT_EXPIRES });
  res.json({ token });
};

exports.logout = (req, res) => {
  res.json({ message: 'Logout successful, clear token on client' });
};