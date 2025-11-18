import express from 'express';
import { verifyDrugBatch, createDrugBatch } from '../controllers/drugBatchController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/verify').post(protect, verifyDrugBatch);
// Protect creation route and restrict to manufacturers and admins
router.post('/', protect, restrictTo('manufacturer', 'admin'), createDrugBatch);

export default router;
