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

// Helper: Calculate distance between two coordinates (Haversine Formula)
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const deg2rad = (deg) => deg * (Math.PI / 180);

// @desc    Verify a product batch
// @route   POST /api/products/verify
// @access  Public
export const verifyProductBatch = asyncHandler(async (req, res) => {
  const { batchNumber, latitude, longitude, accuracy } = req.body;
  
  // Get Client IP
  const clientIp = requestIp.getClientIp(req); 
  const geo = geoip.lookup(clientIp);

  // 1. Start Session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const productBatch = await ProductBatch.findOne({ batchNumber }).session(session);
    const now = new Date();

    let status;
    let warningMessage = null;

    // --- LOCATION SPOOFING CHECK ---
    // We accept a margin of error (e.g., 500km) because Mobile IPs can be routed far away.
    // But if IP is in London and GPS is in Lagos (~5000km), that's a spoof.
    let isSpoofed = false;
    if (geo && latitude && longitude) {
      const distance = getDistanceFromLatLonInKm(geo.ll[0], geo.ll[1], latitude, longitude);
      if (distance > 1000) { // 1000km threshold (Conservative)
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
    // 🚨 Security: Check Spoofing
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
    // 🚨 Security: Check Cloning (Velocity)
    else if (productBatch.verificationCount >= productBatch.maxScansAllowed) {
      status = 'Suspicious';
      warningMessage = "Abnormal scan activity detected. This code may have been cloned.";
      
      // Auto-flag
      if (productBatch.status === 'Active') {
        productBatch.status = 'Suspicious';
        await productBatch.save({ session });
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
          // Find Manufacturer Email
          const manufacturer = await User.findById(productBatch.manufacturer);
          if (manufacturer) {
            await sendEmail({
              email: manufacturer.email,
              subject: `🚨 SECURITY ALERT: Clone Detected - ${productBatch.productName}`,
              message: `
                URGENT: A product batch has exceeded its maximum safe scan limit.
                
                Product: ${productBatch.productName}
                Batch: ${batchNumber}
                Scan Count: ${productBatch.verificationCount + 1} / ${productBatch.maxScansAllowed}
                
                This batch has been automatically flagged as SUSPICIOUS. 
                Please login to the Verifi Portal to review this incident.
              `
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

    // 2. Create Log
    await VerificationLog.create([{
      productBatch: batchNumber,
      scannedBy: req.user ? req.user._id : null,
      status,
      location: { latitude, longitude, locationAccuracy: accuracy },
      deviceInfo: req.headers['user-agent'] || 'Unknown Device',
      // Optional: Save the inferred IP location for audit
      ipLocation: geo ? `${geo.city}, ${geo.country}` : 'Unknown' 
    }], { session });

    // 3. Update Count
    if (productBatch) {
      await ProductBatch.updateOne(
          { _id: productBatch._id }, 
          { $inc: { verificationCount: 1 } }
      ).session(session);
    }

    await session.commitTransaction();

    // --- REWARD LOGIC ---
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
      message: warningMessage,
      pointsEarned 
    });

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// @desc    Create a new product batch
// @route   POST /api/products
// @access  Protected (Manufacturer Only)
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

// @desc    Update a batch
// @route   PUT /api/products/:id
// @access  Protected (Manufacturer Only)
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

// @desc    Delete a batch
// @route   DELETE /api/products/:id
// @access  Protected (Manufacturer Only)
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

// @desc    Get all batches (Regulator)
// @route   GET /api/products/all-inventory
// @access  Protected (Regulator)
export const getAllBatches = asyncHandler(async (req, res) => {
  const batches = await ProductBatch.find({})
    .populate('manufacturer', 'firstName lastName organizationDetails.orgName')
    .sort({ createdAt: -1 });
  res.json(batches);
});

// @desc    Bulk update
// @route   PUT /api/products/bulk-update
// @access  Regulator / Manufacturer
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

// @desc    Transfer custody (Manufacturer -> Distributor -> Retailer)
// @route   POST /api/products/transfer
// @access  Manufacturer, Distributor, Retailer
export const transferCustody = asyncHandler(async (req, res) => {
  const { batchNumber, action, location, notes, recipientEmail } = req.body;
  
  // 1. Find Batch
  const batch = await ProductBatch.findOne({ batchNumber });
  if (!batch) {
    res.status(404);
    throw new Error('Batch not found');
  }

  // 2. Validation: Only allowed if you are the CURRENT owner?
  // For MVP, we trust any authorized "Distributor" account to scan it in.
  // In V2, we would check if req.user._id matches the last "recipient".

  // 3. Log the Event
  batch.custodyChain.push({
    handler: req.user._id,
    action, // e.g., "Received"
    location,
    notes
  });

  // Optional: If 'Shipped', you might set status to 'In-Transit'
  if (action === 'Shipped') batch.status = 'In-Transit';
  if (action === 'Received') batch.status = 'Active';

  await batch.save();

  res.json({ message: `Custody updated: ${action}`, chain: batch.custodyChain });
});