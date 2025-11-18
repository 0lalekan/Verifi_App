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

	// Check if user exists
	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error('User already exists');
	}

	const user = await User.create({ firstName, lastName, email, password, role });

	if (user) {
		// Set token cookie
		generateToken(res, user._id);

		res.status(201).json({ _id: user._id, firstName: user.firstName, email: user.email, role: user.role });
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
		res.json({ _id: user._id, firstName: user.firstName, email: user.email, role: user.role });
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

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set expiry
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  // Placeholder: send email (log for now)
  console.log(`Password reset email sent to ${email}. Reset token: ${resetToken} (unhashed for testing)`);

  res.status(200).json({ message: 'Password reset email sent' });
});

// @desc    Reset password with token
// @route   POST /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Hash token to match with DB
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  // Update password and clear reset fields
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
  const validProducts = await ProductBatch.countDocuments({
    $or: [
      { status: { $exists: false } },
      { status: 'In-Transit' },
      { status: 'At-Pharmacy' },
      { status: 'Dispensed' }
    ]
  }); // Assuming these are valid statuses
  const expiredProducts = await ProductBatch.countDocuments({ expiryDate: { $lt: new Date() } });

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

export { registerUser, authUser, getUserProfile, forgotPassword, resetPassword, getDashboardStats };
