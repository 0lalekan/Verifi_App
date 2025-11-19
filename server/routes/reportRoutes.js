import express from 'express';
import { upload } from '../multerConfig.js';
import { createReport, getAllReports, updateReportStatus } from '../controllers/reportController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', upload.single('evidenceImage'), createReport);
router.get('/', protect, restrictTo('regulator'), getAllReports);
router.put('/:id', protect, restrictTo('regulator'), updateReportStatus); // New Route

export default router;