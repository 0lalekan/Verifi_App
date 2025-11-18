import asyncHandler from 'express-async-handler';
import Report from '../models/ReportModel.js';

const createReport = asyncHandler(async (req, res) => {
  const { productName, batchNumber, location, description } = req.body;

  const reporter = req.user ? req.user._id : null;

  let evidenceImage = null;
  if (req.file) {
    evidenceImage = '/uploads/' + req.file.filename;
  }

  const newReport = await Report.create({
    productName,
    batchNumber,
    location,
    description,
    evidenceImage,
    reporter
  });

  res.status(201).json(newReport);
});

const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find().populate('reporter', 'name email');

  res.json(reports);
});

export { createReport, getAllReports };
