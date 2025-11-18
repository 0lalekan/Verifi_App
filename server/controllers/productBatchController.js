import asyncHandler from 'express-async-handler';
import ProductBatch from '../models/productBatchModel.js';
import VerificationLog from '../models/VerificationLogModel.js';
import User from '../models/userModel.js';
import csv from 'csv-parser';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

// @desc    Verify a product batch by batchNumber
// @route   POST /api/productbatches/verify
// @access  Public
export const verifyProductBatch = asyncHandler(async (req, res) => {
  const { batchNumber, latitude, longitude, accuracy } = req.body;

  const productBatch = await ProductBatch.findOne({ batchNumber });

  let status;
  if (!productBatch) {
    status = 'Fake';
  } else {
    // Check if expired
    const now = new Date();
    status = productBatch.expiryDate < now ? 'Expired' : 'Valid';
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
    res.status(200).json({ status: 'Valid', product: productBatch, pointsEarned });
  } else {
    res.status(200).json({ status, pointsEarned: 0 });
  }
});

// @desc    Create a new product batch
// @route   POST /api/productbatches
// @access  Protected (manufacturer/admin)
export const createProductBatch = asyncHandler(async (req, res) => {
  const { batchNumber, productName, expiryDate, manufacturingDate, medicalDetails } = req.body;
  const manufacturer = req.user && req.user._id;

  const newProduct = await ProductBatch.create({
    batchNumber,
    productName,
    expiryDate,
    manufacturingDate,
    manufacturer,
    medicalDetails,
    verificationCount: 0,
  });

  if (newProduct) {
    res.status(201).json(newProduct);
  } else {
    res.status(400);
    throw new Error('Invalid product batch data');
  }
});

// @desc    Upload and process batch list from CSV
// @route   POST /api/productbatches/upload
// @access  Protected (manufacturer/admin)
export const uploadBatchList = asyncHandler(async (req, res) => {
  const filePath = req.file.path;

  const manufacturer = req.user && req.user._id;

  const dataArray = [];

  await new Promise((resolve, reject) => {
    fsSync.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Map CSV headers to schema fields
        const productData = {
          batchNumber: row.BatchNumber,
          productName: row.ProductName,
          manufacturer,
          expiryDate: new Date(row.ExpiryDate),
          manufacturingDate: new Date(row.ManufacturingDate),
          medicalDetails: {
            description: row.Description,
            dosage: row.Dosage,
            sideEffects: row.SideEffects,
            activeIngredients: row.ActiveIngredients,
            manufacturedBy: row.ManufacturedBy,
          },
          verificationCount: 0,
        };
        dataArray.push(productData);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  await ProductBatch.insertMany(dataArray);

  await fs.unlink(filePath);

  res.status(201).json({ message: 'Batch list uploaded and processed.', count: dataArray.length });
});

export default {
  verifyProductBatch,
  createProductBatch,
  uploadBatchList,
};
