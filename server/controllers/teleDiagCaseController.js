import asyncHandler from 'express-async-handler';
import TeleDiagCase from '../models/TeleDiagCaseModel.js';

// @desc    Create a new tele-diagnostic case
// @route   POST /api/telecases
// @access  Protected (referring nurse)
export const createCase = asyncHandler(async (req, res) => {
  const { patientIdentifier, symptoms, specialtyRequired, caseNotes, attachments } = req.body;

  const referringNurse = req.user && req.user._id;

  const createdCase = await TeleDiagCase.create({
    patientIdentifier,
    symptoms,
    specialtyRequired,
    caseNotes: caseNotes || '',
    attachments: attachments || [],
    referringNurse,
    status: 'Open',
  });

  if (createdCase) {
    res.status(201).json(createdCase);
  } else {
    res.status(400);
    throw new Error('Invalid case data');
  }
});

// @desc    Get all open cases (optionally filtered by specialist's specialty)
// @route   GET /api/telecases/open
// @access  Protected (specialist)
export const getOpenCases = asyncHandler(async (req, res) => {
  const query = { status: 'Open' };

  // If the logged-in user is a specialist and has a specialty, filter by it
  const specialty = req.user && req.user.specialistDetails && req.user.specialistDetails.specialty;
  if (specialty) query.specialtyRequired = specialty;

  const cases = await TeleDiagCase.find(query).populate('referringNurse', 'firstName lastName email');
  res.status(200).json(cases);
});

// @desc    Get a case by ID
// @route   GET /api/telecases/:id
// @access  Protected
export const getCaseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const foundCase = await TeleDiagCase.findById(id)
    .populate('referringNurse', 'firstName lastName email')
    .populate('assignedSpecialist', 'firstName lastName email');

  if (foundCase) {
    res.status(200).json(foundCase);
  } else {
    res.status(404);
    throw new Error('Case not found');
  }
});

// @desc    Update case with final report and close it
// @route   PATCH /api/telecases/:id/report
// @access  Protected (specialist)
export const updateCaseReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { diagnosis, recommendation } = req.body;

  const teleCase = await TeleDiagCase.findById(id);
  if (!teleCase) {
    res.status(404);
    throw new Error('Case not found');
  }

  teleCase.finalReport = teleCase.finalReport || {};
  teleCase.finalReport.diagnosis = diagnosis;
  teleCase.finalReport.recommendation = recommendation;
  teleCase.finalReport.submittedAt = Date.now();

  teleCase.status = 'Closed';
  teleCase.assignedSpecialist = req.user && req.user._id;

  const updatedCase = await teleCase.save();
  res.status(200).json(updatedCase);
});

export default {
  createCase,
  getOpenCases,
  getCaseById,
  updateCaseReport,
};
