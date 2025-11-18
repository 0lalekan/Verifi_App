import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { getAllVerificationLogs } from '../controllers/logController.js';

const router = express.Router();

router.get('/', protect, restrictTo('admin', 'specialist', 'regulator'), getAllVerificationLogs);

export default router;
