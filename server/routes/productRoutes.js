import express from 'express';
import { verifyProductBatch, createProductBatch, uploadBatchList } from '../controllers/productBatchController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { upload } from '../multerConfig.js';

const router = express.Router();

router.route('/verify').post(verifyProductBatch);
// Protect creation route and restrict to manufacturers and admins
router.post('/', protect, restrictTo('manufacturer', 'admin'), createProductBatch);
router.post('/bulk-upload', protect, restrictTo('manufacturer', 'admin'), upload.single('batchFile'), uploadBatchList);

export default router;
