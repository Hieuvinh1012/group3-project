const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const cors = require('cors');
app.use(express.json());
// Enable CORS so frontend (running on another origin/port) can call the API
app.use(cors());

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

  app.get('/', (req, res) => {
  res.send('✅ Backend server is running on Render!');
});

// Routes
const userRoutes = require('./routes/user');
app.use('/users', userRoutes);
const authRoutes = require('./routes/auth'); // Thêm route authentication
app.use('/auth', authRoutes); // Sử dụng route /auth cho signup, login, logout

app.use('/profile', require('./routes/profile'));
// Advanced features: forgot/reset password, upload-avatar
const advancedRoutes = require('./routes/advanced');
app.use('/advanced', advancedRoutes);       

// Default backend port set to 3001 to match frontend axios base URL
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));