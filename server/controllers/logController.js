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

export { getAllVerificationLogs, getUserLogs };