import asyncHandler from 'express-async-handler';
import VerificationLog from '../models/VerificationLogModel.js';

const getAllVerificationLogs = asyncHandler(async (req, res) => {
  const logs = await VerificationLog.find().populate('scannedBy', 'firstName email');
  res.status(200).json(logs);
});

export { getAllVerificationLogs };
