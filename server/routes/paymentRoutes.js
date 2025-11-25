import express from 'express';
import { initializePayment, verifyPayment } from '../controllers/paymentController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/initialize', protect, restrictTo('manufacturer'), initializePayment);
router.post('/verify', protect, restrictTo('manufacturer'), verifyPayment);

export default router;