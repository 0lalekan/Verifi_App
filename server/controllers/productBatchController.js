import asyncHandler from 'express-async-handler';
import ProductBatch from '../models/productBatchModel.js';
import VerificationLog from '../models/VerificationLogModel.js';
import User from '../models/userModel.js';
import csv from 'csv-parser';
import fs from 'fs/promises';
import fsSync from 'fs';

// @desc    Verify a product batch
// @route   POST /api/products/verify
// @access  Public
export const verifyProductBatch = asyncHandler(async (req, res) => {
  const { batchNumber, latitude, longitude, accuracy } = req.body;

  const productBatch = await ProductBatch.findOne({ batchNumber });

  let status;
  if (!productBatch) {
    status = 'Fake';

    // 🚨 REAL-TIME ALERT TRIGGER
    // This sends a signal to all connected Regulators immediately
    if (req.io) {
      req.io.emit('admin_alert', {
        type: 'FAKE_SCAN',
        message: `⚠️ Counterfeit Detected! Batch: ${batchNumber}`,
        location: latitude && longitude ? { lat: latitude, lng: longitude } : 'Unknown',
        timestamp: new Date()
      });
    }
  } else {
    const now = new Date();
    status = productBatch.expiryDate < now ? 'Expired' : 'Valid';
  }

  // Log the scan
  await VerificationLog.create({
    productBatch: batchNumber,
    scannedBy: req.user ? req.user._id : null,
    status,
    location: {
      latitude,
      longitude,
      locationAccuracy: accuracy,
    },
    deviceInfo: req.headers['user-agent'] || 'Unknown Device',
  });

  // Award Points logic
  let pointsEarned = 0;
  if (status === 'Valid' && req.user) {
    const priorLog = await VerificationLog.findOne({
      scannedBy: req.user._id,
      productBatch: batchNumber,
      status: 'Valid',
    });

    if (!priorLog) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.points += 5;
        await user.save();
        pointsEarned = 5;
      }
    }
  }

  res.status(200).json({ 
    status, 
    product: status === 'Valid' ? productBatch : null, 
    pointsEarned 
  });
});

// @desc    Create a new product batch
// @route   POST /api/products
// @access  Protected (Manufacturer Only)
export const createProductBatch = asyncHandler(async (req, res) => {
  // 1. Security Check: Is Manufacturer Verified?
  if (req.user.role === 'manufacturer' && !req.user.organizationDetails?.isVerified) {
    res.status(403);
    throw new Error('Action Forbidden: Your organization account is pending verification.');
  }

  const { batchNumber, productName, expiryDate, manufacturingDate, productAttributes } = req.body;
  const manufacturer = req.user._id;

  const batchExists = await ProductBatch.findOne({ batchNumber });
  if (batchExists) {
    res.status(400);
    throw new Error('Batch number already exists');
  }

  const newProduct = await ProductBatch.create({
    batchNumber,
    productName,
    expiryDate,
    manufacturingDate,
    manufacturer,
    productAttributes,
    verificationCount: 0,
  });

  if (newProduct) {
    res.status(201).json(newProduct);
  } else {
    res.status(400);
    throw new Error('Invalid product batch data');
  }
});

// @desc    Get all batches for logged-in manufacturer
// @route   GET /api/products/my-inventory
// @access  Protected (Manufacturer Only)
export const getManufacturerBatches = asyncHandler(async (req, res) => {
  const batches = await ProductBatch.find({ manufacturer: req.user._id })
    .sort({ createdAt: -1 });
  res.json(batches);
});

// @desc    Upload batch list
// @route   POST /api/products/bulk-upload
// @access  Protected (Manufacturer Only)
export const uploadBatchList = asyncHandler(async (req, res) => {
  // 1. Security Check
  if (req.user.role === 'manufacturer' && !req.user.organizationDetails?.isVerified) {
    // Cleanup file if rejected
    if (req.file) await fs.unlink(req.file.path);
    res.status(403);
    throw new Error('Action Forbidden: Your organization account is pending verification.');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const filePath = req.file.path;
  const manufacturer = req.user._id;
  const dataArray = [];

  try {
    await new Promise((resolve, reject) => {
      fsSync.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          if (row.batchNumber && row.productName) {
            dataArray.push({
              batchNumber: row.batchNumber,
              productName: row.productName,
              manufacturer,
              expiryDate: row.expiryDate ? new Date(row.expiryDate) : new Date(),
              manufacturingDate: row.manufacturingDate ? new Date(row.manufacturingDate) : new Date(),
              productAttributes: {
                description: row.description || ''
              },
              verificationCount: 0,
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (dataArray.length > 0) {
      await ProductBatch.insertMany(dataArray, { ordered: false }).catch(err => {
        console.log('Some duplicates skipped');
      });
    }

    await fs.unlink(filePath);
    res.status(201).json({ message: 'Batch list processed.', count: dataArray.length });

  } catch (error) {
    await fs.unlink(filePath);
    res.status(500);
    throw new Error('Failed to process CSV file');
  }
});

export default {
  verifyProductBatch,
  createProductBatch,
  uploadBatchList,
  getManufacturerBatches,
};