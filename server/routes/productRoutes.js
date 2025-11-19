import express from 'express';
import { 
  verifyProductBatch, 
  createProductBatch, 
  uploadBatchList, 
  getManufacturerBatches // Import
} from '../controllers/productBatchController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { upload } from '../multerConfig.js';

const router = express.Router();

router.route('/verify').post(verifyProductBatch);
router.post('/', protect, restrictTo('manufacturer', 'regulator'), createProductBatch);
router.post('/bulk-upload', protect, restrictTo('manufacturer', 'regulator'), upload.single('batchFile'), uploadBatchList);
router.get('/my-inventory', protect, restrictTo('manufacturer'), getManufacturerBatches); // New Route

export default router;