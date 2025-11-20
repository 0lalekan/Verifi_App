import asyncHandler from 'express-async-handler';
import Report from '../models/ReportModel.js';
import ProductBatch from '../models/productBatchModel.js';

const createReport = asyncHandler(async (req, res) => {
  const { productName, batchNumber, location, description } = req.body;

  const reporter = req.user ? req.user._id : null;

  let evidenceImage = null;
  if (req.file) {
    evidenceImage = req.file.path;
  }

  // Parse latitude and longitude from location string if present
  let coordinates = null;
  const latLonMatch = location.match(/Lat:\s*([-\d.]+),\s*Lon:\s*([-\d.]+)/);
  if (latLonMatch) {
    coordinates = {
      latitude: parseFloat(latLonMatch[1]),
      longitude: parseFloat(latLonMatch[2])
    };
  }

  const newReport = await Report.create({
    productName,
    batchNumber,
    location,
    description,
    evidenceImage,
    reporter,
    ...(coordinates && { coordinates })
  });

  res.status(201).json(newReport);
});

const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find().populate('reporter', 'firstName email lastName').sort({ createdAt: -1 });
  res.json(reports);
});

// @desc    Update report status
// @route   PUT /api/reports/:id
// @access  Protected (Regulator)
const updateReportStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const report = await Report.findById(req.params.id);

  if (report) {
    report.status = status || report.status;
    report.adminNotes = adminNotes || report.adminNotes;
    const updatedReport = await report.save();
    res.json(updatedReport);
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

// @desc    Get reports submitted by the logged-in user
// @route   GET /api/reports/my-reports
const getMyReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ reporter: req.user._id }).sort({ createdAt: -1 });
  res.json(reports);
});

// @desc    Get reports related to the manufacturer's products
// @route   GET /api/reports/manufacturer-reports
const getManufacturerReports = asyncHandler(async (req, res) => {
  // 1. Find all batches created by this manufacturer
  const myBatches = await ProductBatch.find({ manufacturer: req.user._id });
  
  // 2. Extract unique Batch Numbers and Product Names
  const batchNumbers = myBatches.map(b => b.batchNumber);
  const productNames = [...new Set(myBatches.map(b => b.productName))]; // Unique names

  // 3. Find reports that match either the Batch Number OR the Product Name
  // This ensures they see reports even if the batch number scanned was a fake one, 
  // provided the product name matches their brand.
  const reports = await Report.find({
    $or: [
      { batchNumber: { $in: batchNumbers } },
      { productName: { $in: productNames } } // Fuzzy match could be better, but exact match works for now
    ]
  }).sort({ createdAt: -1 });

  res.json(reports);
});

export { 
  createReport, 
  getAllReports, 
  updateReportStatus, 
  getMyReports, 
  getManufacturerReports 
};