import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js'; // Ensure capitalization matches your file

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// --- NEW: Optional Auth (The Fix) ---
// This checks for a token but DOES NOT throw an error if missing.
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
    } catch (error) {
      // If token is invalid/expired, just ignore it and proceed as anonymous
      console.log("Optional auth token failed, proceeding as anonymous");
    }
  }
  next();
});

// Restrict to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('You do not have permission to perform this action');
    }
    next();
  };
};

export default { protect, optionalAuth, restrictTo };