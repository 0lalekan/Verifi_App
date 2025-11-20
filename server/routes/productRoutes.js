import express from 'express';
import { 
  verifyProductBatch, 
  createProductBatch, 
  uploadBatchList, 
  getManufacturerBatches,
  updateProductBatch, // Import
  deleteProductBatch  // Import
} from '../controllers/productBatchController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validateProductBatch } from '../middleware/validationMiddleware.js';
import { upload } from '../multerConfig.js';

const router = express.Router();

router.route('/verify').post(verifyProductBatch);

router.post('/', protect, restrictTo('manufacturer', 'regulator'), validateProductBatch, createProductBatch);

router.post('/bulk-upload', protect, restrictTo('manufacturer', 'regulator'), upload.single('batchFile'), uploadBatchList);

router.get('/my-inventory', protect, restrictTo('manufacturer'), getManufacturerBatches);

// --- NEW ROUTES ---
router.route('/:id')
  .put(protect, restrictTo('manufacturer', 'regulator'), updateProductBatch)
  .delete(protect, restrictTo('manufacturer'), deleteProductBatch);

export default router;