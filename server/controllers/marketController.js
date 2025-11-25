import asyncHandler from 'express-async-handler';
import MarketListing from '../models/MarketListingModel.js';

// @desc    Get all active listings
// @route   GET /api/market
// @access  Protected (B2B Roles)
export const getListings = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  let query = { status: 'Active' };

  if (category) query.category = category;
  if (search) {
    query.productName = { $regex: search, $options: 'i' };
  }

  const listings = await MarketListing.find(query)
    .populate('seller', 'organizationDetails.orgName email')
    .sort({ createdAt: -1 });

  res.json(listings);
});

// @desc    Create a listing
// @route   POST /api/market
// @access  Protected (Manufacturer/Distributor)
export const createListing = asyncHandler(async (req, res) => {
  const { productName, description, category, price, minOrderQuantity } = req.body;
  const user = req.user;

  // --- 1. CHECK PLAN LIMITS ---
  const PLAN_LIMITS = {
    'Starter': 0,       // Free users CANNOT post
    'Growth': 50,       // 50 active listings
    'Scale': 999999     // Unlimited
  };

  const currentListings = await MarketListing.countDocuments({ 
    seller: user._id, 
    status: 'Active' 
  });

  // Default to Starter if plan is missing
  const userPlan = user.organizationDetails?.plan || 'Starter';
  const limit = PLAN_LIMITS[userPlan];

  // Check Limit
  if (currentListings >= limit) {
    res.status(403);
    throw new Error(`Plan Limit Reached. You are on the ${userPlan} plan (Limit: ${limit}). Please upgrade to post more listings.`);
  }
  // ----------------------------
  
  const listing = await MarketListing.create({
    seller: req.user._id,
    productName,
    description,
    category,
    price,
    minOrderQuantity,
    image: req.file ? req.file.path : null
  });

  res.status(201).json(listing);
});

// @desc    Get my listings
// @route   GET /api/market/my-listings
export const getMyListings = asyncHandler(async (req, res) => {
  const listings = await MarketListing.find({ seller: req.user._id }).sort({ createdAt: -1 });
  res.json(listings);
});