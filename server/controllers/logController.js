import asyncHandler from 'express-async-handler';
import VerificationLog from '../models/VerificationLogModel.js';

// Get all logs (Admin/Regulator)
const getAllVerificationLogs = asyncHandler(async (req, res) => {
  const logs = await VerificationLog.find().populate('scannedBy', 'firstName email').sort({ createdAt: -1 });
  res.status(200).json(logs);
});

// Get logs for the logged-in user (Consumer History)
const getUserLogs = asyncHandler(async (req, res) => {
  const logs = await VerificationLog.find({ scannedBy: req.user._id })
    .sort({ createdAt: -1 })
    .limit(10); // Last 10 scans
  res.status(200).json(logs);
});

// @desc    Get clustered "Safe Locations" based on valid scan history
// @route   GET /api/logs/safe-map
// @access  Public (Consumer)
const getSafeRetailers = asyncHandler(async (req, res) => {
  const safeSpots = await VerificationLog.aggregate([
    // 1. Filter: Only Valid scans
    { $match: { status: 'Valid' } },
    
    // 2. Group: Round coordinates to ~110m (3 decimal places) to cluster nearby scans
    {
      $group: {
        _id: { 
          lat: { $round: ["$location.latitude", 3] }, 
          lon: { $round: ["$location.longitude", 3] } 
        },
        count: { $sum: 1 },
        lastScan: { $max: "$createdAt" }
      }
    },

    // 3. Filter: Only show spots with significant history (e.g., > 2 valid scans)
    // This prevents a single user's home from appearing as a "Retailer"
    { $match: { count: { $gte: 3 } } },

    // 4. Project: Clean format for Frontend
    {
      $project: {
        _id: 0,
        latitude: "$_id.lat",
        longitude: "$_id.lon",
        trustScore: "$count", // Heatmap intensity
        lastVerified: "$lastScan"
      }
    }
  ]);

  res.json(safeSpots);
});

export { getAllVerificationLogs, getUserLogs, getSafeRetailers };