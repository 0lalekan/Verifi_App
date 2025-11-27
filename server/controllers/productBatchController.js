import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Joi from 'joi';
import geoip from 'geoip-lite';
import requestIp from 'request-ip';
import sendEmail from '../utils/sendEmail.js';
import ProductBatch from '../models/productBatchModel.js';
import VerificationLog from '../models/VerificationLogModel.js';
import User from '../models/userModel.js';
import csv from 'csv-parser';
import fs from 'fs/promises';
import fsSync from 'fs';

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

const deg2rad = (deg) => deg * (Math.PI / 180);

// @desc    Verify a product batch
// @route   POST /api/products/verify
export const verifyProductBatch = asyncHandler(async (req, res) => {
  const { batchNumber, latitude, longitude, accuracy } = req.body;
  
  const clientIp = requestIp.getClientIp(req); 
  const geo = geoip.lookup(clientIp);

  // FIX: No Transactions (Prevents MongoServerError on single nodes)
  
  const productBatch = await ProductBatch.findOne({ batchNumber });
  const now = new Date();

  let status;
  let warningMessage = null;

  // --- LOCATION SPOOFING CHECK ---
  let isSpoofed = false;
  if (geo && latitude && longitude) {
    const distance = getDistanceFromLatLonInKm(geo.ll[0], geo.ll[1], latitude, longitude);
    if (distance > 1000) { 
      isSpoofed = true;
    }
  }

  // --- CORE VERIFICATION LOGIC ---
  if (!productBatch) {
    status = 'Fake';
  } 
  else if (['Recalled', 'Investigating', 'Suspicious'].includes(productBatch.status)) {
    status = productBatch.status;
    warningMessage = `This batch is marked as ${productBatch.status}. Do not use.`;
  }
  else if (productBatch.expiryDate < now) {
    status = 'Expired';
  }
  else if (isSpoofed) {
    status = 'Suspicious';
    warningMessage = "Location mismatch detected. This scan appears to be spoofed.";
    
    if (req.io) {
      req.io.emit('admin_alert', {
        type: 'SPOOF_DETECTED',
        message: `⚠️ Geo-Spoofing! IP (${geo.city}) vs GPS (${latitude.toFixed(2)},${longitude.toFixed(2)}) mismatch.`,
        timestamp: new Date()
      });
    }
  }
  else if (productBatch.verificationCount >= productBatch.maxScansAllowed) {
    status = 'Suspicious';
    warningMessage = "Abnormal scan activity detected. This code may have been cloned.";
    
    if (productBatch.status === 'Active') {
      productBatch.status = 'Suspicious';
      await productBatch.save(); 
    }
    
    if (req.io) {
      req.io.emit('admin_alert', {
        type: 'CLONE_DETECTED',
        message: `⚠️ Clone Suspected! Batch ${batchNumber} exceeded scan limit.`,
        timestamp: new Date()
      });
    }

    (async () => {
      try {
        const manufacturer = await User.findById(productBatch.manufacturer);
        if (manufacturer) {
          await sendEmail({
            email: manufacturer.email,
            subject: `🚨 SECURITY ALERT: Clone Detected - ${productBatch.productName}`,
            message: `URGENT: Batch ${batchNumber} has exceeded its scan limit.`
          });
        }
      } catch (err) {
        console.error('Failed to send alert email:', err);
      }
    })();
    
  } 
  else {
    status = 'Valid';
  }

  // --- FIX: REWARD LOGIC (Moved BEFORE Log Creation) ---
  // If we create the log first, we will always find "a previous scan" (the one we just made).
  let pointsEarned = 0;
  
  if (status === 'Valid' && req.user) {
    // Check if THIS user has scanned THIS batch before
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

  // --- CREATE LOG ---
  await VerificationLog.create({
    productBatch: batchNumber,
    scannedBy: req.user ? req.user._id : null, // Now properly populated by optionalAuth
    status,
    location: { latitude, longitude, locationAccuracy: accuracy },
    deviceInfo: req.headers['user-agent'] || 'Unknown Device',
    ipLocation: geo ? `${geo.city}, ${geo.country}` : 'Unknown' 
  });

  // --- UPDATE COUNT ---
  if (productBatch) {
    await ProductBatch.updateOne(
        { _id: productBatch._id }, 
        { $inc: { verificationCount: 1 } }
    );
  }

  res.status(200).json({ 
    status, 
    product: status === 'Valid' ? productBatch : null, 
    message: warningMessage,
    pointsEarned 
  });
});

// ... (Keep createProductBatch, getManufacturerBatches, etc. exactly as they were in the previous update)
// Just ensure you don't delete the rest of the file content!
export const createProductBatch = asyncHandler(async (req, res) => {
  if (req.user.role === 'manufacturer' && !req.user.organizationDetails?.isVerified) {
    res.status(403);
    throw new Error('Action Forbidden: Your organization account is pending verification.');
  }

  const { 
    batchNumber, 
    productName, 
    expiryDate, 
    manufacturingDate, 
    productAttributes,
    quantity 
  } = req.body;
  
  const manufacturer = req.user._id;

  const batchExists = await ProductBatch.findOne({ batchNumber });
  if (batchExists) {
    res.status(400);
    throw new Error('Batch number already exists');
  }

  const estimatedQuantity = quantity ? parseInt(quantity) : 1000; 
  const maxScansAllowed = Math.ceil(estimatedQuantity * 2);

  const newProduct = await ProductBatch.create({
    batchNumber,
    productName,
    expiryDate,
    manufacturingDate,
    manufacturer,
    productAttributes,
    verificationCount: 0,
    maxScansAllowed,
  });

  if (newProduct) {
    res.status(201).json(newProduct);
  } else {
    res.status(400);
    throw new Error('Invalid product batch data');
  }
});

export const getManufacturerBatches = asyncHandler(async (req, res) => {
  const batches = await ProductBatch.find({ manufacturer: req.user._id })
    .sort({ createdAt: -1 });
  res.json(batches);
});

export const uploadBatchList = asyncHandler(async (req, res) => {
  if (req.user.role === 'manufacturer' && !req.user.organizationDetails?.isVerified) {
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
  const errors = [];

  const rowSchema = Joi.object({
    batchNumber: Joi.string().required(),
    productName: Joi.string().required(),
    quantity: Joi.number().integer().min(1).optional(),
    expiryDate: Joi.date().required(),
    manufacturingDate: Joi.date().required(),
    description: Joi.string().allow('').optional()
  });

  try {
    await new Promise((resolve, reject) => {
      fsSync.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const { error, value } = rowSchema.validate(row, { allowUnknown: true });
          
          if (error) {
            errors.push(`Row Error (${row.batchNumber || 'Unknown'}): ${error.message}`);
          } else {
            const quantity = value.quantity ? parseInt(value.quantity) : 1000;
            
            dataArray.push({
              batchNumber: value.batchNumber,
              productName: value.productName,
              manufacturer,
              expiryDate: new Date(value.expiryDate),
              manufacturingDate: new Date(value.manufacturingDate),
              maxScansAllowed: Math.ceil(quantity * 2),
              productAttributes: { description: value.description || '' },
              verificationCount: 0,
              status: 'Active'
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (dataArray.length > 0) {
      await ProductBatch.insertMany(dataArray, { ordered: false }).catch(err => {
        console.log('Duplicate entries skipped');
      });
    }

    await fs.unlink(filePath);
    
    res.status(201).json({ 
      message: 'Batch processing complete.', 
      count: dataArray.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    if (fsSync.existsSync(filePath)) await fs.unlink(filePath);
    res.status(500);
    throw new Error('Failed to process CSV file: ' + error.message);
  }
});

export const updateProductBatch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { productName, expiryDate, status, maxScansAllowed } = req.body;

  const batch = await ProductBatch.findById(id);

  if (!batch) {
    res.status(404);
    throw new Error('Batch not found');
  }

  if (batch.manufacturer.toString() !== req.user._id.toString() && req.user.role !== 'regulator') {
    res.status(401);
    throw new Error('Not authorized to edit this batch');
  }

  batch.productName = productName || batch.productName;
  batch.expiryDate = expiryDate || batch.expiryDate;
  batch.status = status || batch.status;
  batch.maxScansAllowed = maxScansAllowed || batch.maxScansAllowed;

  const updatedBatch = await batch.save();
  res.json(updatedBatch);
});

export const deleteProductBatch = asyncHandler(async (req, res) => {
  const batch = await ProductBatch.findById(req.params.id);

  if (!batch) {
    res.status(404);
    throw new Error('Batch not found');
  }

  if (batch.manufacturer.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  if (batch.verificationCount > 0) {
    res.status(400);
    throw new Error('Cannot delete active batch. Use "Recall" status instead.');
  }

  await batch.deleteOne();
  res.json({ message: 'Batch removed' });
});

export const getAllBatches = asyncHandler(async (req, res) => {
  const batches = await ProductBatch.find({})
    .populate('manufacturer', 'firstName lastName organizationDetails.orgName')
    .sort({ createdAt: -1 });
  res.json(batches);
});

export const bulkUpdateProductBatches = asyncHandler(async (req, res) => {
  const { ids, status } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error('No items selected');
  }

  if (req.user.role === 'manufacturer') {
    const ownedCount = await ProductBatch.countDocuments({
      _id: { $in: ids },
      manufacturer: req.user._id
    });
    if (ownedCount !== ids.length) {
      res.status(403);
      throw new Error('You can only update your own products');
    }
  }

  const result = await ProductBatch.updateMany(
    { _id: { $in: ids } },
    { $set: { status } }
  );

  res.json({ 
    message: `Updated ${result.modifiedCount} products to ${status}`,
    count: result.modifiedCount 
  });
});

export const transferCustody = asyncHandler(async (req, res) => {
  const { batchNumber, action, location, notes, recipientEmail } = req.body;
  
  const batch = await ProductBatch.findOne({ batchNumber });
  if (!batch) {
    res.status(404);
    throw new Error('Batch not found');
  }

  batch.custodyChain.push({
    handler: req.user._id,
    action, // e.g., "Received"
    location,
    notes
  });

  if (action === 'Shipped') batch.status = 'In-Transit';
  if (action === 'Received') batch.status = 'Active';

  await batch.save();

  res.json({ message: `Custody updated: ${action}`, chain: batch.custodyChain });
});