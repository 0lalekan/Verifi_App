import asyncHandler from 'express-async-handler';
import DrugBatch from '../models/DrugBatchModel.js';
import VerificationLog from '../models/VerificationLogModel.js';
import User from '../models/userModel.js';

// @desc    Verify a drug batch by batchNumber
// @route   POST /api/drugbatches/verify
// @access  Public
export const verifyDrugBatch = asyncHandler(async (req, res) => {
  const { batchNumber, latitude, longitude, accuracy } = req.body;

  const drugBatch = await DrugBatch.findOne({ batchNumber });

  let status;
  if (!drugBatch) {
    status = 'Fake';
  } else {
    // Check if expired
    const now = new Date();
    status = drugBatch.expiryDate < now ? 'Expired' : 'Valid';
  }

  // Create VerificationLog
  await VerificationLog.create({
    productBatch: batchNumber,
    scannedBy: req.user ? req.user._id : null,
    status,
    location: {
      latitude,
      longitude,
      locationAccuracy: accuracy,
    },
    deviceInfo: req.headers['user-agent'] || '',
  });

  let pointsEarned = 0;
  if (status === 'Valid' && req.user) {
    // Check for prior 'Valid' log to prevent duplicate point earning
    const priorLog = await VerificationLog.findOne({
      scannedBy: req.user._id,
      productBatch: batchNumber,
      status: 'Valid',
    });
    const hasPriorValidLog = !!priorLog;

    if (!hasPriorValidLog) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.points += 5;
        await user.save();
        pointsEarned = 5;
      }
    }
  }

  if (status === 'Valid') {
    res.status(200).json({ status: 'Valid', drug: drugBatch, pointsEarned });
  } else {
    res.status(200).json({ status, pointsEarned: 0 });
  }
});

// @desc    Create a new drug batch
// @route   POST /api/drugbatches
// @access  Protected (manufacturer/admin)
export const createDrugBatch = asyncHandler(async (req, res) => {
  const { batchNumber, drugName, expiryDate, manufacturingDate, medicalDetails } = req.body;
  const manufacturer = req.user && req.user._id;

  const newDrug = await DrugBatch.create({
    batchNumber,
    drugName,
    expiryDate,
    manufacturingDate,
    manufacturer,
    medicalDetails,
    verificationCount: 0,
  });

  if (newDrug) {
    res.status(201).json(newDrug);
  } else {
    res.status(400);
    throw new Error('Invalid drug batch data');
  }
});

export default {
  verifyDrugBatch,
  createDrugBatch,
};
