const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken.js');
const userController = require('../controllers/userController.js');
const { allow } = require('../middlewares/index.js');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.get('/profile', verifyToken, userController.getUserProfile);
router.get('/users/:id/history', verifyToken, userController.getUserHistory);

// Admin/Receptionist only
router.get('/users', verifyToken, ...allow(['admin', 'receptionist']), userController.getAllUsers);
router.delete('/users/:id', verifyToken, ...allow(['admin', 'receptionist']), userController.deleteUser);
router.put('/users/:id', verifyToken, userController.updateUser); // Allow users to update themselves? Need to check controller.

module.exports = router;
