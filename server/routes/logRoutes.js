import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { getAllVerificationLogs, getUserLogs } from '../controllers/logController.js'; // Import getUserLogs

const router = express.Router();

router.get('/', protect, restrictTo('regulator'), getAllVerificationLogs);
router.get('/my-history', protect, getUserLogs); // New Endpoint

export default router;