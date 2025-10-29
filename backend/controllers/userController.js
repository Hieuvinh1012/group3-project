const User = require('../models/User');

// GET /users - chỉ admin
exports.getUsers = async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin access only' });
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// POST /users - tạo user (public)
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    // allow users to update themselves or admins
    if (req.userId && req.userId.toString() !== id && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updated = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // allow if admin, or if the authenticated user is deleting their own account
    const isSelf = req.userId && req.userId.toString() === id;
    if (req.userRole !== 'admin' && !isSelf) return res.status(403).json({ message: 'Forbidden' });
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

