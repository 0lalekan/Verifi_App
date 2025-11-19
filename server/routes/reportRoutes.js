import express from 'express';
import { upload } from '../multerConfig.js';
import { 
  createReport, 
  getAllReports, 
  updateReportStatus, 
  getMyReports, 
  getManufacturerReports 
} from '../controllers/reportController.js';
import { protect, restrictTo, optionalAuth } from '../middleware/authMiddleware.js'; // Import optionalAuth

const router = express.Router();

// FIX: Add optionalAuth here so req.user is populated if logged in
router.post('/', optionalAuth, upload.single('evidenceImage'), createReport);

router.get('/', protect, restrictTo('regulator'), getAllReports);
router.put('/:id', protect, restrictTo('regulator'), updateReportStatus);

router.get('/my-reports', protect, restrictTo('consumer'), getMyReports);
router.get('/manufacturer-reports', protect, restrictTo('manufacturer'), getManufacturerReports);

export default router;