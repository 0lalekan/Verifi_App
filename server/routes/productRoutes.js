import express from 'express';
import { rateLimit } from 'express-rate-limit'; // Import Rate Limit
import { 
  verifyProductBatch, 
  createProductBatch, 
  uploadBatchList, 
  getManufacturerBatches,
  updateProductBatch,
  deleteProductBatch,
  getAllBatches,
  bulkUpdateProductBatches
} from '../controllers/productBatchController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validateProductBatch } from '../middleware/validationMiddleware.js';
import { localUpload } from '../multerConfig.js';

const router = express.Router();

// --- 1. DEFINE RATE LIMITER ---
// Allow max 50 verification attempts per IP per 15 minutes
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 50, 
  message: { message: 'Too many verification attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- 2. PUBLIC ROUTES ---
// Apply limiter specifically to the verify endpoint
router.route('/verify').post(verifyLimiter, verifyProductBatch);

// --- 3. PROTECTED ROUTES ---
router.post('/', protect, restrictTo('manufacturer', 'regulator'), validateProductBatch, createProductBatch);

router.post('/bulk-upload', protect, restrictTo('manufacturer', 'regulator'), localUpload.single('batchFile'), uploadBatchList);

router.get('/my-inventory', protect, restrictTo('manufacturer'), getManufacturerBatches);

router.get('/all-inventory', protect, restrictTo('regulator'), getAllBatches);

router.put('/bulk-update', protect, restrictTo('regulator', 'manufacturer'), bulkUpdateProductBatches);

router.route('/:id')
  .put(protect, restrictTo('manufacturer', 'regulator'), updateProductBatch)
  .delete(protect, restrictTo('manufacturer'), deleteProductBatch);

export default router;