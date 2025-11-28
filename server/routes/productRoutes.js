import express from 'express';
import { rateLimit } from 'express-rate-limit'; 
import { 
  verifyProductBatch, 
  createProductBatch, 
  uploadBatchList, 
  getManufacturerBatches,
  updateProductBatch,
  deleteProductBatch,
  getAllBatches,
  bulkUpdateProductBatches,
  transferCustody,
} from '../controllers/productBatchController.js';
import { protect, restrictTo, optionalAuth } from '../middleware/authMiddleware.js'; // <--- IMPORT optionalAuth
import { validateProductBatch } from '../middleware/validationMiddleware.js';
import { localUpload } from '../multerConfig.js';

const router = express.Router();

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 50, 
  message: { message: 'Too many verification attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- 2. PUBLIC ROUTES ---
// FIX: Added optionalAuth so logged-in users get identified (Points/History)
router.route('/verify').post(verifyLimiter, optionalAuth, verifyProductBatch);

// --- 3. PROTECTED ROUTES ---
router.post('/', protect, restrictTo('manufacturer', 'regulator'), validateProductBatch, createProductBatch);

router.post('/bulk-upload', protect, restrictTo('manufacturer', 'regulator'), localUpload.single('batchFile'), uploadBatchList);

router.get('/my-inventory', protect, restrictTo('manufacturer'), getManufacturerBatches);

router.get('/all-inventory', protect, restrictTo('regulator'), getAllBatches);

router.put('/bulk-update', protect, restrictTo('regulator', 'manufacturer'), bulkUpdateProductBatches);

router.post('/transfer', protect, restrictTo('manufacturer', 'distributor', 'retailer'), transferCustody);

router.route('/:id')
  .put(protect, restrictTo('manufacturer', 'regulator'), updateProductBatch)
  .delete(protect, restrictTo('manufacturer'), deleteProductBatch);

export default router;