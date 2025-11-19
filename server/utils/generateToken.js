import jwt from 'jsonwebtoken';

/**
 * Generates a JWT and sets it as a secure, httpOnly cookie on the response object.
 * @param {object} res - The Express response object.
 * @param {string} userId - The user's MongoDB ObjectId to be included in the JWT payload.
 */
const generateToken = (res, userId) => {
  if (!process.env.JWT_SECRET) {
    console.error('Fatal error: JWT_SECRET is not defined in environment variables');
    throw new Error('JWT_SECRET must be defined in environment variables');
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
