import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import * as auth from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/http.js';
import { CITIES } from '../services/catalog.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, data: null, message: 'Too many attempts. Please try again in a few minutes.' },
});

const email = body('email').trim().isEmail().withMessage('Enter a valid email').toLowerCase();

router.post(
  '/register',
  authLimiter,
  validate([
    body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),
    email,
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('city').optional().isIn(CITIES).withMessage('Choose a supported city'),
  ]),
  asyncHandler(auth.register)
);

router.post(
  '/login',
  authLimiter,
  validate([email, body('password').notEmpty().withMessage('Password is required')]),
  asyncHandler(auth.login)
);

router.get('/me', protect, auth.me);
router.patch(
  '/me',
  protect,
  validate([
    body('name').optional().trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),
    body('city').optional().isIn(CITIES).withMessage('Choose a supported city'),
    body('bio').optional().trim().isLength({ max: 280 }).withMessage('Bio must be under 280 characters'),
  ]),
  asyncHandler(auth.updateMe)
);
router.post('/logout', protect, auth.logout);

export default router;
