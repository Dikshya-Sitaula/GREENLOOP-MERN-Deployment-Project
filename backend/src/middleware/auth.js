import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { ApiError, asyncHandler } from '../utils/http.js';

export const signToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

async function userFromRequest(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    return await User.findById(payload.sub);
  } catch {
    return null;
  }
}

export const protect = asyncHandler(async (req, res, next) => {
  const user = await userFromRequest(req);
  if (!user) throw new ApiError(401, 'Please log in to continue');
  req.user = user;
  next();
});

// Attaches req.user when a valid token is present, but never blocks.
export const optionalAuth = asyncHandler(async (req, res, next) => {
  req.user = await userFromRequest(req);
  next();
});

export const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) return next(new ApiError(403, 'You do not have permission to do that'));
  next();
};
