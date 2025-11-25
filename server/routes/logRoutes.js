import express from 'express';
import { protect, restrictTo, optionalAuth } from '../middleware/authMiddleware.js'; // Use optionalAuth for public map
import { 
  getAllVerificationLogs, 
  getUserLogs, 
  getSafeRetailers
} from '../controllers/logController.js';

const router = express.Router();

router.get('/', protect, restrictTo('regulator'), getAllVerificationLogs);
router.get('/my-history', protect, getUserLogs);

// 🔥 NEW: Public Map Data (Anyone can see safe spots)
router.get('/safe-map', optionalAuth, getSafeRetailers);

export default router;