import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../models/userModel.js';
import ProductBatch from '../models/productBatchModel.js';
import Report from '../models/ReportModel.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';


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

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    
    // --- NEW CHECK: Block Suspended Users ---
    if (!user.isActive) {
      res.status(403); // Forbidden
      throw new Error('Your account has been suspended. Contact a regulator.');
    }
    // ----------------------------------------

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
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.file) {
      user.profileImage = req.file.path;
    }

    if (req.body.role) {
      user.role = req.body.role;
    }

    // FIXED: Handle Organization Details Parsing
    if (req.body.organizationDetails) {
      try {
        const orgData = typeof req.body.organizationDetails === 'string' 
          ? JSON.parse(req.body.organizationDetails) 
          : req.body.organizationDetails;
        
        // Merge existing details with updates
        user.organizationDetails = {
           ...user.organizationDetails,
           ...orgData
        };

        // Only reset verification if Name or License changes
        if ((orgData.orgName && orgData.orgName !== user.organizationDetails.orgName) || 
            (orgData.orgLicense && orgData.orgLicense !== user.organizationDetails.orgLicense)) {
            user.organizationDetails.isVerified = false;
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

// ... (keep forgotPassword, resetPassword, getDashboardStats as is) ...

// @desc    Forgot Password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // 1. Get Reset Token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 2. Hash token and save to DB
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes

  await user.save({ validateBeforeSave: false });

  // 3. Create Reset URL
  // Ensure CLIENT_URL is set in your .env (e.g., CLIENT_URL=http://localhost:5173)
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const message = `
    You are receiving this email because you (or someone else) has requested the reset of a password.
    Please click the link below to verify:
    \n\n ${resetUrl} \n\n
    If you did not request this, please ignore this email.
  `;

  try {
    // 4. ACTUALLY SEND THE EMAIL
    await sendEmail({
      email: user.email,
      subject: 'Verifi Password Reset Token',
      message,
    });

    console.log(`Reset token generated for ${email}`); // Debug log
    res.status(200).json({ success: true, data: 'Email sent' });
    
  } catch (err) {
    console.error(err);
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

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalProducts = await ProductBatch.countDocuments();
  const validProducts = await ProductBatch.countDocuments({ 
    status: 'Active',
    expiryDate: { $gt: new Date() } 
  });
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

const getPendingVerifications = asyncHandler(async (req, res) => {
  const pendingUsers = await User.find({
    role: 'manufacturer',
    'organizationDetails.isVerified': false
  }).select('-password');
  res.json(pendingUsers);
});

// FIXED: Ensure we target the nested field correctly
const verifyManufacturer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Explicitly mark the subdocument field as modified if needed, though direct assignment usually works
    user.organizationDetails.isVerified = true;
    
    // Ensure we save the top-level document
    await user.save();
    
    res.json({ message: `Organization ${user.organizationDetails?.orgName} Verified` });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get ALL manufacturers (Verified & Pending)
// @route   GET /api/users/manufacturers
// @access  Regulator
const getAllManufacturers = asyncHandler(async (req, res) => {
  const manufacturers = await User.find({ role: 'manufacturer' })
    .select('-password') // Don't send passwords
    .sort({ createdAt: -1 });
  res.json(manufacturers);
});

// @desc    Revoke verification (License) & Flag Products
// @route   PUT /api/users/revoke/:id
// @access  Regulator
const revokeManufacturer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // 1. Revoke the License
    user.organizationDetails.isVerified = false;
    await user.save();

    // 2. BULK ACTION: Flag all their products as 'Suspicious'
    // This ensures all existing QR codes in the market will now scan as "Fake/Suspicious"
    const result = await ProductBatch.updateMany(
      { manufacturer: user._id },
      { $set: { status: 'Suspicious' } }
    );

    res.json({ 
      message: `License for ${user.organizationDetails.orgName || 'User'} revoked.`,
      details: `${result.modifiedCount} product batches have been flagged as Suspicious.`
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Toggle Active Status (Flag/Suspend User)
// @route   PUT /api/users/toggle-status/:id
// @access  Regulator
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.isActive = !user.isActive; // Toggle true/false
    await user.save();
    res.json({ 
      message: `User ${user.isActive ? 'Activated' : 'Suspended'}`, 
      isActive: user.isActive 
    });
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
  verifyManufacturer,
  getAllManufacturers,
  revokeManufacturer,
  toggleUserStatus
};