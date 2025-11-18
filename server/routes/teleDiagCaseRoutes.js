import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import {
	createCase,
	getOpenCases,
	getCaseById,
	updateCaseReport,
} from '../controllers/teleDiagCaseController.js';

const router = express.Router();

router.route('/').post(protect, restrictTo('nurse'), createCase);
router.route('/open').get(protect, restrictTo('specialist'), getOpenCases);
router.route('/:id').get(protect, getCaseById);
router.route('/:id/report').put(protect, restrictTo('specialist'), updateCaseReport);

export default router;
