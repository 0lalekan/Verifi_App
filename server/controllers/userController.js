// server/controllers/userController.js
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../models/userModel.js';
import ProductBatch from '../models/productBatchModel.js';
import Report from '../models/ReportModel.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// ... (Keep registerUser, authUser, getUserProfile as is) ...
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, organizationDetails } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ 
    firstName, lastName, email, password, role,
    organizationDetails: role === 'manufacturer' ? {
      ...organizationDetails,
      licenseStatus: 'Pending' // Default for new users
    } : undefined
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({ _id: user._id, firstName: user.firstName, email: user.email, role: user.role });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isActive) {
      res.status(403);
      throw new Error('Your account has been suspended. Contact a regulator.');
    }
    generateToken(res, user._id);
    res.json({ _id: user._id, firstName: user.firstName, email: user.email, role: user.role });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      points: user.points || 0,
      profileImage: user.profileImage,
      organizationDetails: user.organizationDetails
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;

    if (req.body.password) user.password = req.body.password;
    if (req.file) user.profileImage = req.file.path;
    if (req.body.role) user.role = req.body.role;

    if (req.body.organizationDetails) {
      try {
        const orgData = typeof req.body.organizationDetails === 'string' 
          ? JSON.parse(req.body.organizationDetails) 
          : req.body.organizationDetails;
        
        user.organizationDetails = { ...user.organizationDetails, ...orgData };

        // Reset verification if critical info changes
        if ((orgData.orgName && orgData.orgName !== user.organizationDetails.orgName) || 
            (orgData.orgLicense && orgData.orgLicense !== user.organizationDetails.orgLicense)) {
            user.organizationDetails.isVerified = false;
            user.organizationDetails.licenseStatus = 'Pending'; // Reset status
        }
      } catch (e) {
        console.error("Error parsing organization details", e);
      }
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role,
      points: updatedUser.points,
      profileImage: updatedUser.profileImage,
      organizationDetails: updatedUser.organizationDetails,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// ... (keep forgotPassword, resetPassword, getDashboardStats) ...
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const message = `Reset Password Link: \n\n ${resetUrl}`;

  try {
    await sendEmail({ email: user.email, subject: 'Verifi Password Reset', message });
    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
  if (!user) { res.status(400); throw new Error('Invalid or expired token'); }
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.status(200).json({ message: 'Password reset successful' });
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalProducts = await ProductBatch.countDocuments();
  const validProducts = await ProductBatch.countDocuments({ status: 'Active', expiryDate: { $gt: new Date() } });
  const expiredProducts = await ProductBatch.countDocuments({ $or: [{ status: 'Expired' }, { expiryDate: { $lt: new Date() } }] });
  const totalReports = await Report.countDocuments();
  const pendingReports = await Report.countDocuments({ status: 'Pending' });
  res.json({ totalProducts, validProducts, expiredProducts, totalReports, pendingReports });
});

const getPendingVerifications = asyncHandler(async (req, res) => {
  const pendingUsers = await User.find({ role: 'manufacturer', 'organizationDetails.isVerified': false }).select('-password');
  res.json(pendingUsers);
});

// UPDATED: Verify Manufacturer
const verifyManufacturer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.organizationDetails.isVerified = true;
    user.organizationDetails.licenseStatus = 'Verified'; // Set status
    await user.save();
    res.json({ message: `Organization ${user.organizationDetails?.orgName} Verified` });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getAllManufacturers = asyncHandler(async (req, res) => {
  const manufacturers = await User.find({ role: 'manufacturer' }).select('-password').sort({ createdAt: -1 });
  res.json(manufacturers);
});

// UPDATED: Revoke Manufacturer
const revokeManufacturer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.organizationDetails.isVerified = false;
    user.organizationDetails.licenseStatus = 'Revoked'; // Set status
    await user.save();
    
    await ProductBatch.updateMany({ manufacturer: user._id }, { $set: { status: 'Suspicious' } });

    res.json({ message: `License Revoked. Products flagged.` });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'Activated' : 'Suspended'}`, isActive: user.isActive });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { 
  registerUser, authUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword, 
  getDashboardStats, getPendingVerifications, verifyManufacturer, getAllManufacturers, 
  revokeManufacturer, toggleUserStatus 
};