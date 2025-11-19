import express from 'express';
import { 
  registerUser, 
  authUser, 
  getUserProfile, 
  updateUserProfile, 
  forgotPassword, 
  resetPassword, 
  getDashboardStats,
  getPendingVerifications, // Import
  verifyManufacturer       // Import
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { upload } from '../multerConfig.js';

const router = express.Router();

router.route('/').post(registerUser);
router.post('/login', authUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('profileImage'), updateUserProfile);

router.get('/stats', protect, getDashboardStats);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// --- New Regulator Routes ---
router.get('/pending-verifications', protect, restrictTo('regulator'), getPendingVerifications);
router.put('/verify/:id', protect, restrictTo('regulator'), verifyManufacturer);

export default router;