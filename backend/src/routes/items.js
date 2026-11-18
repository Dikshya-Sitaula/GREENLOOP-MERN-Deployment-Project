import { Router } from 'express';
import { body, query } from 'express-validator';
import * as items from '../controllers/itemController.js';
import { optionalAuth, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { uploadImages } from '../middleware/upload.js';
import { asyncHandler } from '../utils/http.js';
import { CITIES, CONDITIONS, STATUSES, TYPES } from '../services/catalog.js';
import { isCategory } from '../services/categoryService.js';

const categoryField = (chain) => chain.custom((v) => isCategory(v));

const router = Router();

const fields = (optional = false) => {
  const opt = (chain) => (optional ? chain.optional() : chain);
  return [
    opt(body('title').trim().isLength({ min: 3, max: 90 })).withMessage('Title must be 3–90 characters'),
    opt(body('description').trim().isLength({ min: 10, max: 2000 })).withMessage('Description must be 10–2000 characters'),
    opt(categoryField(body('category'))).withMessage('Choose a category'),
    opt(body('condition').isIn(CONDITIONS)).withMessage('Choose a condition'),
    opt(body('type').isIn(TYPES)).withMessage('Choose how you want to pass it on'),
    opt(body('city').isIn(CITIES)).withMessage('Choose a city'),
    body('price').optional().isFloat({ min: 0, max: 10000000 }).withMessage('Price must be a positive number').toFloat(),
    body('wantInReturn').optional().trim().isLength({ max: 140 }).withMessage('Keep it under 140 characters'),
    body('wantedCategory').optional({ values: 'falsy' }).custom((v) => isCategory(v)).withMessage('Choose a valid wanted category'),
    body('wantedNote').optional().trim().isLength({ max: 140 }).withMessage('Keep the note under 140 characters'),
    body('images').optional().isArray({ max: 5 }).withMessage('Up to 5 images'),
    ...(optional ? [body('images').optional().isArray({ min: 1 }).withMessage('Keep at least one photo')] : []),
    body('images.*').optional().isString().matches(/^(\/uploads\/[\w.-]+|\/images\/[\w.-]+|https:\/\/[^\s]+)$/).withMessage('Invalid image URL'),
  ];
};

const sellNeedsPrice = body('price').custom((v, { req }) => {
  if (req.body.type === 'sell' && !(Number(v) > 0)) throw new Error('Set a price for items you want to sell');
  return true;
});

router.post('/upload', protect, uploadImages, items.uploadFiles);
router.post('/score-preview', validate([categoryField(body('category')).withMessage('Choose a category'), body('condition').isIn(CONDITIONS), body('type').isIn(TYPES)]), items.scorePreview);

router.get(
  '/',
  optionalAuth,
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be 1 or higher'),
    query('limit').optional().isInt({ min: 1, max: 48 }).withMessage('Limit must be between 1 and 48'),
  ]),
  asyncHandler(items.list)
);
router.get('/:id', optionalAuth, asyncHandler(items.getOne));
router.post('/', protect, validate([...fields(), sellNeedsPrice]), asyncHandler(items.create));
router.patch('/:id', protect, validate(fields(true)), asyncHandler(items.update));
router.delete('/:id', protect, asyncHandler(items.remove));
router.patch(
  '/:id/status',
  protect,
  validate([body('status').isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(', ')}`)]),
  asyncHandler(items.setStatus)
);

export default router;
