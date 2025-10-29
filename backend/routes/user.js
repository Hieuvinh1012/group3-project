const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const profileController = require('../controllers/profileController');

// GET: Lấy danh sách người dùng (mounted at /users in server.js)
// Chỉ admin được xem danh sách -> bảo vệ bằng auth middleware
router.get('/', profileController.authMiddleware, userController.getUsers);

// POST: Thêm người dùng mới
router.post('/', userController.createUser);

// sửa (yêu cầu xác thực)
router.put('/:id', profileController.authMiddleware, userController.updateUser);
// xóa (yêu cầu xác thực)
router.delete('/:id', profileController.authMiddleware, userController.deleteUser);





module.exports = router;