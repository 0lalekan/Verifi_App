import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { upload } from '../multerConfig.js';
import { getListings, createListing, getMyListings } from '../controllers/marketController.js';

const router = express.Router();

// Only B2B roles can access the market
const b2bRoles = ['manufacturer', 'distributor', 'retailer'];

router.get('/', protect, restrictTo(...b2bRoles), getListings);
router.get('/my-listings', protect, restrictTo('manufacturer', 'distributor'), getMyListings);
router.post('/', protect, restrictTo('manufacturer', 'distributor'), upload.single('image'), createListing);

export default router;