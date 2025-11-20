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
  const now = new Date();

  let status;
  let warningMessage = null;

  // 1. Check Existence
  if (!productBatch) {
    status = 'Fake';
    // ... (Keep your existing Socket.io alert logic here) ...
  } 
  // 2. Check Recall / Manual Flags
  else if (['Recalled', 'Investigating', 'Suspicious'].includes(productBatch.status)) {
    status = productBatch.status; // Return the bad status directly
    warningMessage = `This batch is marked as ${productBatch.status}. Do not use.`;
  }
  // 3. Check Expiry
  else if (productBatch.expiryDate < now) {
    status = 'Expired';
  }
  // 4. HARDENING: Check Scan Velocity (Anti-Cloning)
  else if (productBatch.verificationCount >= productBatch.maxScansAllowed) {
    status = 'Suspicious';
    warningMessage = "Abnormal scan activity detected. This code may have been cloned.";
    
    // Optionally auto-update DB to flag it permanently
    if (productBatch.status === 'Active') {
        productBatch.status = 'Suspicious';
        await productBatch.save();
    }
    
    // Trigger Alert for Manufacturer/Regulator
    if (req.io) {
      req.io.emit('admin_alert', {
        type: 'CLONE_DETECTED',
        message: `⚠️ Clone Suspected! Batch ${batchNumber} exceeded scan limit.`,
        timestamp: new Date()
      });
    }
  } 
  // 5. Valid
  else {
    status = 'Valid';
  }

  // Log the scan
  await VerificationLog.create({
    productBatch: batchNumber,
    scannedBy: req.user ? req.user._id : null,
    status,
    location: { latitude, longitude, locationAccuracy: accuracy },
    deviceInfo: req.headers['user-agent'] || 'Unknown Device',
  });

  // Increment count only if product exists
  if (productBatch) {
    // We don't await this save to keep response fast, unless strict consistency is needed
    ProductBatch.updateOne(
        { _id: productBatch._id }, 
        { $inc: { verificationCount: 1 } }
    ).exec();
  }

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
    message: warningMessage, // Send warning to frontend
    pointsEarned: status === 'Valid' ? 5 : 0 
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

  const { 
    batchNumber, 
    productName, 
    expiryDate, 
    manufacturingDate, 
    productAttributes,
    quantity // Manufacturer should send this
  } = req.body;
  
  const manufacturer = req.user._id;

  const batchExists = await ProductBatch.findOne({ batchNumber });
  if (batchExists) {
    res.status(400);
    throw new Error('Batch number already exists');
  }

  // 2. Calculate Safe Scan Limit
  // If I produce 1000 bottles, it's impossible to have 5000 scans.
  // We allow a buffer (e.g., 1.5x or 2x) for user error/rescans.
  const estimatedQuantity = quantity ? parseInt(quantity) : 1000; 
  const maxScansAllowed = Math.ceil(estimatedQuantity * 2); // 2x buffer

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
  // 1. Security Check
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

  try {
    await new Promise((resolve, reject) => {
      fsSync.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          if (row.batchNumber && row.productName) {
            
            // --- NEW LOGIC START ---
            // 1. Parse Quantity (Default to 1000 if missing)
            const quantity = row.quantity ? parseInt(row.quantity) : 1000;
            
            // 2. Calculate Max Scans (e.g., 2x buffer)
            const maxScansAllowed = Math.ceil(quantity * 2);
            // --- NEW LOGIC END ---

            dataArray.push({
              batchNumber: row.batchNumber,
              productName: row.productName,
              manufacturer,
              expiryDate: row.expiryDate ? new Date(row.expiryDate) : new Date(),
              manufacturingDate: row.manufacturingDate ? new Date(row.manufacturingDate) : new Date(),
              // Add the limit to the database object
              maxScansAllowed: maxScansAllowed, 
              productAttributes: {
                description: row.description || ''
              },
              verificationCount: 0,
              status: 'Active' // Explicitly set status
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (dataArray.length > 0) {
      // Use ordered: false so one duplicate doesn't fail the whole batch
      await ProductBatch.insertMany(dataArray, { ordered: false }).catch(err => {
        console.log('Some duplicates skipped');
      });
    }

    await fs.unlink(filePath);
    res.status(201).json({ message: 'Batch list processed.', count: dataArray.length });

  } catch (error) {
    if (fsSync.existsSync(filePath)) await fs.unlink(filePath);
    res.status(500);
    throw new Error('Failed to process CSV file: ' + error.message);
  }
});

// @desc    Update a batch (e.g., fix typos or recall product)
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

  // Ensure ownership
  if (batch.manufacturer.toString() !== req.user._id.toString() && req.user.role !== 'regulator') {
    res.status(401);
    throw new Error('Not authorized to edit this batch');
  }

  // Update allowed fields
  batch.productName = productName || batch.productName;
  batch.expiryDate = expiryDate || batch.expiryDate;
  batch.status = status || batch.status;
  batch.maxScansAllowed = maxScansAllowed || batch.maxScansAllowed;

  const updatedBatch = await batch.save();
  res.json(updatedBatch);
});

// @desc    Delete a batch (Only if it has 0 scans)
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

  // Safety Check: Don't delete if it's already in the market
  if (batch.verificationCount > 0) {
    res.status(400);
    throw new Error('Cannot delete a batch that has already been scanned by consumers. Mark it as "Recalled" instead.');
  }

  await batch.deleteOne();
  res.json({ message: 'Batch removed' });
});
