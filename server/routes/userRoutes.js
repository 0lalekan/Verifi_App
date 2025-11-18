import express from 'express';
import { registerUser, authUser, getUserProfile, forgotPassword, resetPassword, getDashboardStats } from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.get('/stats', protect, getDashboardStats);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
