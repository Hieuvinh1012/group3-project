const express = require('express');
const router = express.Router();
const advancedController = require('../controllers/advancedController');
const profileController = require('../controllers/profileController');
const multer = require('multer');

// Use memory storage so we can build a data URL from buffer for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route để xử lý yêu cầu quên mật khẩu
router.post('/forgot-password', advancedController.forgotPassword);

// Route để xử lý đặt lại mật khẩu
router.post('/reset-password', advancedController.resetPassword);

// Route để tải lên avatar
// Upload avatar (protected) - accepts form-data file field named 'avatar' OR JSON { file: 'data:...'}
router.post('/upload-avatar', profileController.authMiddleware, upload.single('avatar'), advancedController.uploadAvatar);

module.exports = router;