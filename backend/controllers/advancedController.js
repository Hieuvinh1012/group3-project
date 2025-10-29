const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // npm install nodemailer
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcryptjs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// POST /advanced/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

  const resetSecret = process.env.RESET_SECRET || 'reset-secret';
  const RESET_EXPIRES = process.env.RESET_EXPIRES || '1h';
  const token = jwt.sign({ id: user._id }, resetSecret, { expiresIn: RESET_EXPIRES });
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset/${token}`;

    // Configure transporter from env if available
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Reset your password',
        text: `Use this link to reset your password: ${resetUrl}`,
        html: `<p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
      });

      return res.json({ message: 'Reset link sent to email' });
    }

    // If no SMTP configured (dev), return reset URL in response to ease testing
    return res.json({ message: 'No SMTP configured - use this reset link (dev)', resetUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// POST /advanced/reset-password
exports.resetPassword = async (req, res) => {
  try {
    // Accept token from body, query string or URL param to ease testing
    const token = req.body.token || req.query.token || req.params.token;
    const { password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token and password are required' });

    const resetSecret = process.env.RESET_SECRET || 'reset-secret';
    let decoded;
    try {
      decoded = jwt.verify(token, resetSecret);
    } catch (err) {
      console.error('Reset token verify error:', err.message);
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// POST /advanced/upload-avatar (protected)
exports.uploadAvatar = async (req, res) => {
  try {
    // Accept either multipart/form-data file (req.file) or base64/dataURL in req.body.file
    let fileStr = null;
    if (req.file && req.file.buffer) {
      // Build data URL from buffer
      const mime = req.file.mimetype || 'application/octet-stream';
      fileStr = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
    } else if (req.body.file) {
      fileStr = req.body.file;
    }

    if (!fileStr) return res.status(400).json({ message: 'No file provided. Send form-data field "avatar" or JSON {"file":"data:image/...base64..."}' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If Cloudinary is configured, upload there. Otherwise (dev) store data URL in DB.
    if (process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const uploadResponse = await cloudinary.uploader.upload(fileStr, { folder: 'avatars' });
      user.avatar = uploadResponse.secure_url;
    } else {
      // Dev fallback: store data URL directly (not recommended for prod)
      console.warn('Cloudinary not configured, storing data URL in DB (dev only)');
      user.avatar = fileStr;
    }

    await user.save();
    return res.json({ avatar: user.avatar });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};