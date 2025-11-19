import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../models/userModel.js';
import ProductBatch from '../models/productBatchModel.js';
import Report from '../models/ReportModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ firstName, lastName, email, password, role });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({ 
      _id: user._id, 
      firstName: user.firstName, 
      email: user.email, 
      role: user.role 
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({ 
      _id: user._id, 
      firstName: user.firstName, 
      email: user.email, 
      role: user.role 
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error('Email already in use');
      }
      user.email = req.body.email;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.file) {
      user.profileImage = '/uploads/' + req.file.filename;
    }

    if (req.body.role) {
      user.role = req.body.role;
    }

    if (req.body.organizationDetails) {
      try {
        const orgData = typeof req.body.organizationDetails === 'string' 
          ? JSON.parse(req.body.organizationDetails) 
          : req.body.organizationDetails;
          
        user.organizationDetails = { ...user.organizationDetails, ...orgData };
        
        if (orgData.orgName || orgData.orgLicense) {
            user.organizationDetails.isVerified = false; 
        }
      } catch (e) {
        console.error("Error parsing organization details:", e);
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

// @desc    Forgot password - send reset email
// @route   POST /api/users/forgot-password
// @access  Public
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

  await user.save();
  console.log(`Reset token for ${email}: ${resetToken}`); 

  res.status(200).json({ message: 'Password reset email sent' });
});

// @desc    Reset password with token
// @route   POST /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
});

// @desc    Get dashboard stats
// @route   GET /api/users/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalProducts = await ProductBatch.countDocuments();
  
  // UPDATED LOGIC: Count 'Active' products not expired
  const validProducts = await ProductBatch.countDocuments({ 
    status: 'Active',
    expiryDate: { $gt: new Date() } 
  });

  // UPDATED LOGIC: Count Explicitly Expired status OR logic expiration
  const expiredProducts = await ProductBatch.countDocuments({ 
    $or: [
      { status: 'Expired' },
      { expiryDate: { $lt: new Date() } }
    ]
  });

  const totalReports = await Report.countDocuments();
  const pendingReports = await Report.countDocuments({ status: 'Pending' });

  res.json({
    totalProducts,
    validProducts,
    expiredProducts,
    totalReports,
    pendingReports,
  });
});

// @desc    Get all pending manufacturer verifications
// @route   GET /api/users/pending-verifications
// @access  Protected (Regulator Only)
const getPendingVerifications = asyncHandler(async (req, res) => {
  const pendingUsers = await User.find({
    role: 'manufacturer',
    'organizationDetails.isVerified': false
  }).select('-password');

  res.json(pendingUsers);
});

// @desc    Approve a manufacturer
// @route   PUT /api/users/verify/:id
// @access  Protected (Regulator Only)
const verifyManufacturer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.organizationDetails.isVerified = true;
    await user.save();
    res.json({ message: `Organization ${user.organizationDetails?.orgName} Verified` });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { 
  registerUser, 
  authUser, 
  getUserProfile, 
  updateUserProfile, 
  forgotPassword, 
  resetPassword, 
  getDashboardStats,
  getPendingVerifications,
  verifyManufacturer
};