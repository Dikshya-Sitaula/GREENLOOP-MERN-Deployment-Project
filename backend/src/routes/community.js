import { Router } from 'express';
import { body } from 'express-validator';
import Testimonial from '../models/Testimonial.js';
import ContactMessage from '../models/ContactMessage.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler, ok } from '../utils/http.js';

const router = Router();

router.get(
  '/testimonials',
  asyncHandler(async (req, res) => {
    const rows = await Testimonial.find().sort({ createdAt: -1 }).limit(6).populate('user', 'name city avatar').lean();
    ok(res, rows);
  })
);

router.post(
  '/contact',
  validate([
    body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Please tell us your name'),
    body('email').trim().isEmail().withMessage('Enter a valid email').toLowerCase(),
    body('subject').trim().isLength({ min: 3, max: 120 }).withMessage('Add a short subject'),
    body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be at least 10 characters'),
  ]),
  asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;
    await ContactMessage.create({ name, email, subject, message });
    ok(res, null, 'Thanks — your message is on its way to the team', 201);
  })
);

export default router;
