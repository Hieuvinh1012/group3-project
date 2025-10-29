const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Lấy profile hiện tại (yêu cầu token)
router.get('/', profileController.authMiddleware, profileController.getProfile);
// Cập nhật profile hiện tại (yêu cầu token)
router.put('/', profileController.authMiddleware, profileController.updateProfile);

module.exports = router;