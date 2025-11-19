import express from 'express';
import { upload } from '../multerConfig.js';
import { createReport, getAllReports } from '../controllers/reportController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', upload.single('evidenceImage'), createReport);
router.get('/', protect, restrictTo('regulator'), getAllReports);

export default router;
