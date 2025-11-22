import express from 'express';
import { 
  registerUser, 
  authUser, 
  getUserProfile, 
  updateUserProfile, 
  forgotPassword, 
  resetPassword, 
  getDashboardStats,
  getPendingVerifications,
  verifyManufacturer,
  getAllManufacturers,
  revokeManufacturer,
  toggleUserStatus,
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validateRegistration } from '../middleware/validationMiddleware.js';
import { upload } from '../multerConfig.js';

const router = express.Router();

router.route('/').post(validateRegistration, registerUser);
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

// --- REGULATOR: Manufacturer Management ---
router.get('/manufacturers', protect, restrictTo('regulator'), getAllManufacturers);
router.put('/revoke/:id', protect, restrictTo('regulator'), revokeManufacturer);
router.put('/toggle-status/:id', protect, restrictTo('regulator'), toggleUserStatus);

export default router;